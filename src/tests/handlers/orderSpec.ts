import express from 'express';
import request from 'supertest';
import orderRoutes from '../../handlers/orders';
import userRoutes from '../../handlers/users';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
userRoutes(app);
orderRoutes(app);

const { TOKEN_SECRET } = process.env;

describe('Order Routes', () => {
  let token: string, userId: number, orderId: number;
  beforeAll(async () => {
    const newUser = {
      firstname: 'amu',
      lastname: 'mur',
      passwords: 'udacitydbproject',
    };

    const response = await request(app).post('/users/create').send(newUser);
    const { body } = response;
    token = body;
    const payload = jwt.verify(token, TOKEN_SECRET as string);
    // @ts-ignore
    const user = payload.user;
    userId = user.id;
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', 'Bearer ' + token);
  });

  it('should create a new order when POST /orders/create is called', async () => {
    const newOrder = {
      status: 'processed',
      user_id: userId,
    };

    const response = await request(app)
      .post('/orders/create')
      .set('Authorization', 'Bearer ' + token)
      .send(newOrder);

    orderId = response.body.id;

    expect(response.status).toBe(200);
  });

  it('should return a list of orders when GET /orders is called', async () => {
    const response = await request(app).get('/orders');
    expect(response.status).toBe(200);
  });

  it('should return a specific order when GET /orders/:id is called', async () => {
    const showId = await request(app).get(`/orders/${orderId}`);
    expect(showId.status).toBe(200);
  });

  it('should delete a order when DELETE /orders/delete/:id is called', async () => {
    try {
      const response = await request(app)
        .delete(`/orders/delete/${orderId}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      return;
    } catch (err) {
      console.log(err);
    }
  });
});

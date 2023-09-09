import express from 'express';
import request from 'supertest';
import productRoutes from '../../handlers/products';
import orderRoutes from '../../handlers/orders';
import userRoutes from '../../handlers/users';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
userRoutes(app);
orderRoutes(app);
productRoutes(app);

const { TOKEN_SECRET } = process.env;

describe('Product Routes', () => {
  let token: string,
    userId: number,
    productId: number,
    orderId: number,
    id: number;

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

    const newOrder = {
      status: 'processed',
      user_id: userId,
    };

    const res = await request(app)
      .post('/orders/create')
      .set('Authorization', 'Bearer ' + token)
      .send(newOrder);

    orderId = res.body.id;
  });

  afterAll(async () => {
    await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', 'Bearer ' + token);
  });

  it('should create a new product when POST /products/create is called', async () => {
    const newProduct = {
      name: 'book',
      price: 450,
    };

    const response = await request(app)
      .post('/products/create')
      .set('Authorization', 'Bearer ' + token)
      .send(newProduct);

    productId = response.body.id;

    expect(response.status).toBe(200);
  });

  it('should add a product related to the order when POST /products/:id/orders is called', async () => {
    const newProduct = {
      quantity: 10,
      orderId: orderId,
      productId: productId,
    };
    const response = await request(app)
      .post('/products/:id/orders')
      .set('Authorization', 'Bearer ' + token)
      .send(newProduct);

    id = response.body.id;
    expect(response.status).toBe(200);
  });

  it('should return a list of products when GET /products is called', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
  });

  it('should return a specific product when GET /products/:id is called', async () => {
    const showId = await request(app).get(`/products/${productId}`);
    expect(showId.status).toBe(200);
  });

  it('should delete a order when DELETE /products/delete/:id is called', async () => {
    try {
      const response = await request(app)
        .delete(`/products/delete/${productId}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      return;
    } catch (err) {
      console.log(err);
    }
  });
});

import express from 'express';
import request from 'supertest';
import userRoutes from '../../handlers/users';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
userRoutes(app);

const { TOKEN_SECRET } = process.env;

describe('User Routes', () => {
  let token: string, userId: number;

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

  it('should return a list of users when GET /users is called', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
  });

  it('should return a specific user when GET /users/:id is called', async () => {
    // userId = 10;
    const response = await request(app).get(`/users/${userId}`);
    expect(response.status).toBe(200);
  });

  it('should create a new user when POST /users/create is called', async () => {
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

  it('should authenticate a user when POST /users/authenticate is called', async () => {
    const userCredentials = {
      firstname: 'aish',
      passwords: 'udacitydbproject',
    };

    const response = await request(app)
      .post('/users/authenticate')
      .send(userCredentials)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(200);
  });

  it('should delete a user when DELETE /users/delete/:id is called', async () => {
    try {
      const response = await request(app)
        .delete(`/users/delete/${userId}`)
        .set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(200);
      return;
    } catch (err) {
      console.log(err);
    }
  });
});

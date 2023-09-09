import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/users';
import { verifyAuthToken } from './verifyAuthToken';
import jwt from 'jsonwebtoken';
const store = new UserStore();

const { TOKEN_SECRET } = process.env;
const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(404);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const users = await store.show(req.params.id);
    res.json(users);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
    console.log(err);
  }
};

const create = async (_req: Request, res: Response) => {
  try {
    const users: User = {
      firstname: _req.body.firstname,
      lastname: _req.body.lastname,
      passwords: _req.body.passwords,
    };

    if (!users.firstname || !users.lastname || !users.passwords) {
      res.status(404);
      res.send('Invalid firstname or lastname or password');
      return false;
    }
    const newUser = await store.create(users);
    var token = jwt.sign({ user: newUser }, TOKEN_SECRET as string);
    res.json(token);
  } catch (err: any) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const authenticate = async (req: Request, res: Response) => {
  const users: User = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    passwords: req.body.passwords,
  };
  try {
    if (!users.firstname || !users.passwords) {
      res.status(404);
      res.send('Invalid firstname or password');
      return false;
    }
    const authUser = await store.authenticate(users.firstname, users.passwords);
    if (!authUser) {
      res.send(`Cannot authenticate user ${users.firstname} `);
      return false;
    }
    res.json(authUser);
  } catch (err: any) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const isValidId = await store.show(req.params.id);
    if (isValidId) {
      await store.delete(req.params.id);
      res.send('User deleted');
      //res.json(deleted);
    }
    //return;
  } catch (err: any) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users/create', create);
  app.post('/users/authenticate', authenticate);
  app.delete('/users/delete/:id', verifyAuthToken, destroy);
};

export default userRoutes;

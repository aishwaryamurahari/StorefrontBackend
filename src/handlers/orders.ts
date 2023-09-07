import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/orders';
import { verifyAuthToken } from './verifyAuthToken';

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err: any) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const orders = await store.show(req.params.id);
    res.json(orders);
  } catch (err: any) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const create = async (req: Request, res: Response) => {
  const orders: Order = {
    id: req.body.id,
    status: req.body.status,
    user_id: req.body.user_id,
  };
  try {
    const newOrder = await store.create(orders);
    res.json(newOrder);
  } catch (err: any) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const isValidId = await store.show(req.params.id);
    if (isValidId) {
      const deleted = await store.delete(req.params.id);
      res.send('Order deleted');
      res.json(deleted);
    }
  } catch (err: any) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders/create', verifyAuthToken, create);
  app.delete('/orders/delete/:id', verifyAuthToken, destroy);
};

export default orderRoutes;

import express, { Request, Response } from 'express';
import { Product, ProductOrder, ProductStore } from '../models/products';
import { verifyAuthToken } from './verifyAuthToken';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err: any) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const products = await store.show(req.params.id);
    res.json(products);
  } catch (err: any) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const products: Product = {
      name: req.body.name,
      price: req.body.price,
    };
    const newProduct = await store.create(products);
    res.json(newProduct);
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
      res.send('Product deleted');
    }
  } catch (err: any) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const productOrder: ProductOrder = {
      quantity: req.body.quantity,
      order_id: req.body.order_id,
      product_id: req.body.product_id,
    };
    const newProduct = await store.addProduct(productOrder);
    res.json(newProduct);
  } catch (err: any) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products/create', verifyAuthToken, create);
  app.post('/products/:id/orders', verifyAuthToken, addProduct);
  app.delete('/products/delete/:id', verifyAuthToken, destroy);
};

export default productRoutes;

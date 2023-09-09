import { OrderStore } from '../../models/orders';
import { Product, ProductStore } from '../../models/products';
import { UserStore } from '../../models/users';

const store = new ProductStore();
const userStore = new UserStore();
const orderStore = new OrderStore();

describe('Product Model', () => {
  let product_id: number;
  let user_id: number;
  let order_id: number;
  let id: number;

  beforeAll(async () => {
    const user = await userStore.create({
      firstname: 'amu',
      lastname: 'mur',
      passwords: 'udacitydbproject',
    });
    user_id = user.id as number;

    const product = await store.create({
      name: 'book',
      price: 450,
    });
    product_id = product.id as number;

    const order = await orderStore.create({
      status: 'processed',
      user_id: user_id,
    });
    order_id = order.id as number;
  });

  afterAll(async () => {
    await userStore.delete(`${user_id}`);
    await orderStore.delete(`${order_id}`);
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('should return a list of products from index method ', async () => {
    const result = await store.index();
    expect(result).not.toBeNull();
  });

  it('should return the correct product from show method ', async () => {
    const result = await store.show(`${product_id}`);
    expect(result).not.toBeNull();
  });

  it('create method should add an product', async () => {
    const result = await store.create({
      name: 'book',
      price: 450,
    });

    product_id = result.id as number;
    expect(result.name).toEqual('book');
    expect(result.price).toEqual(450);
  });

  it('add method should add an product related to the order', async () => {
    const result = await store.addProduct({
      quantity: 10,
      order_id: order_id,
      product_id: product_id,
    });
    id = result.id as number;
    expect(result.quantity as number).toEqual(10);
    expect(result.order_id as number).toEqual(order_id);
    expect(result.product_id as number).toEqual(product_id);
  });

  it('delete method should remove the product', async () => {
    try {
      const deletedProduct = await store.delete(`${product_id}`);
      expect(deletedProduct).toBe(true);
    } catch (error) {
      console.log(error);
    }
  });
});

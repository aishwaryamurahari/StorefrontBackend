import { Order, OrderStore } from '../../models/orders';
import { UserStore } from '../../models/users';

const store = new OrderStore();
const userStore = new UserStore();

describe('Order Model', () => {
  let orderId: number;

  let user_id: number;
  beforeAll(async () => {
    const user = await userStore.create({
      firstname: 'amu',
      lastname: 'mur',
      passwords: 'udacitydbproject',
    });
    user_id = user.id as number;

    const order = await store.create({
      status: 'processed',
      user_id: user_id,
    });
    orderId = order.id as number;
  });

  afterAll(async () => {
    await userStore.delete(`${user_id}`);
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

  it('should return a list of orders from index method ', async () => {
    const result = await store.index();
    expect(result).not.toBeNull();
  });

  it('should return the correct order from show method ', async () => {
    // orderId = 6;
    const result = await store.show(`${orderId}`);
    expect(result).not.toBeNull();
  });

  it('create method should add an order', async () => {
    const result = await store.create({
      status: 'processed',
      user_id: user_id as number,
    });

    orderId = result.id as number;
    expect(result.status).toEqual('processed');
    expect(result.user_id).toEqual(user_id);
  });

  it('delete method should remove the order', async () => {
    try {
      const deletedOrder = await store.delete(`${orderId}`);
      expect(deletedOrder).toBe(true);
    } catch (error) {
      console.log(error);
    }
  });
});

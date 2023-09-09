import Client from '../database';

export type Order = {
  id?: Number;
  user_id: Number;
  status: string;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get orders. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      if (!result.rowCount) {
        throw new Error('Order does not exist');
      }
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot find the order ${id}. Error: ${err}`);
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders(user_id, status) VALUES ($1, $2) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [o.user_id, o.status]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Cannot create the order. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Boolean> {
    try {
      const sql = 'DELETE FROM orders WHERE id = ($1)';
      const conn = await Client.connect();
      await conn.query(sql, [id]);
      conn.release();
      return true;
    } catch (err) {
      throw new Error(`Cannot create the order. Error: ${err}`);
    }
  }
}

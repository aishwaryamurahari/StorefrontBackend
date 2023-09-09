import Client from '../database';

export type Product = {
  id?: Number;
  name: string;
  price: Number;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get Product. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      if (!result.rowCount) {
        throw new Error('Product does not exist');
      }
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot find the Product ${id}. Error: ${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products( name, price) VALUES ($1, $2) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [p.name, p.price]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Cannot create the Product. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Boolean> {
    try {
      const sql = 'DELETE FROM products WHERE id = ($1)';
      const conn = await Client.connect();
      await conn.query(sql, [id]);
      conn.release();
      return true;
    } catch (err) {
      throw new Error(`Cannot delete the Product. Error: ${err}`);
    }
  }

  async addProduct(
    quantity: number,
    orderId: number,
    productId: number
  ): Promise<{
    quantity: number;
    order_id: number;
    product_id: number;
  }> {
    try {
      const sql =
        'INSERT INTO product_orders (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [quantity, orderId, productId]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`
      );
    }
  }
}

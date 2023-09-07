import Client from '../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
  id: Number;
  firstname: string;
  lastname: string;
  passwords: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get Users. Error: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      if (!result.rowCount) {
        throw new Error('User does not exist');
      }
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot find the User ${id}. Error: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const sql =
        'INSERT INTO users(id, firstname, lastname, passwords) VALUES ($1, $2, $3, $4) RETURNING *';
      const conn = await Client.connect();

      const hash = bcrypt.hashSync(
        u.passwords + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      );

      const result = await conn.query(sql, [
        u.id,
        u.firstname,
        u.lastname,
        hash,
      ]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Cannot create the User ${u.firstname}. Error: ${err}`);
    }
  }

  async authenticate(
    firstname: string,
    passwords: string
  ): Promise<User | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT passwords FROM users WHERE firstname = ($1)';
      const result = await conn.query(sql, [firstname]);
      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(passwords + BCRYPT_PASSWORD, user.passwords)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`Cannot authenticate user ${firstname}.Error ${err}`);
    }
  }

  async delete(id: string): Promise<Boolean> {
    try {
      const sql = 'DELETE FROM users WHERE id = ($1)';
      const conn = await Client.connect();
      await conn.query(sql, [id]);
      conn.release();
      return true;
    } catch (err) {
      throw new Error(`Cannot delete the user. Error: ${err}`);
    }
  }
}

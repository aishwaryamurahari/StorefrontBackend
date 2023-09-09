import { User, UserStore } from '../../models/users';

const store = new UserStore();

describe('User Model', () => {
  let userId: number;

  beforeAll(async () => {
    const user = await store.create({
      firstname: 'amu',
      lastname: 'mur',
      passwords: 'udacitydbproject',
    });
    userId = user.id as number;
  });

  afterAll(async () => {
    await store.delete(`${userId}`);
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

  it('should have a authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('should return a list of users from index method ', async () => {
    const result = await store.index();
    expect(result).not.toBeNull();
  });

  it('should return the correct user from show method ', async () => {
    // userId = 10;
    const result = await store.show(`${userId}`);
    expect(result).not.toBeNull();
  });

  it('create method should add a user', async () => {
    const result = await store.create({
      firstname: 'amu',
      lastname: 'mur',
      passwords: 'udacitydbproject',
    });

    userId = result.id as number;
    expect(result.firstname).toEqual('amu');
    expect(result.lastname).toEqual('mur');
  });

  it('authenticate user with password', async () => {
    const output = await store.authenticate('amu', 'udacitydbproject');
    expect(output).not.toBeNull();
  });

  it('delete method should remove the user', async () => {
    try {
      const deletedUser = await store.delete(`${userId}`);
      expect(deletedUser).toBe(true);
    } catch (error) {
      console.log(error);
    }
  });
});

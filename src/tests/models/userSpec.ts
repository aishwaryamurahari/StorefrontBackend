import { User, UserStore } from '../../models/users';

const store = new UserStore();

describe('User Model', () => {
  let userId: number;
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
    userId = 1;
    const result = await store.show(`${userId}`);
    expect(result).not.toBeNull();
  });

  it('create method should add a user', async () => {
    const result = await store.create({
      id: userId,
      firstname: 'aish',
      lastname: 'mur',
      passwords: 'udacitydbproject',
    });

    userId = result.id as number;
    expect(result.firstname).toEqual('aish');
    expect(result.lastname).toEqual('mur');
  });

  it('authenticate user with password', async () => {
    const output = await store.authenticate('aish', 'udacitydbproject');
    expect(output).not.toBeNull();
  });

  it('delete method should remove the user', async () => {
    await store.delete(`${userId}`);
    const result = await store.index();
    expect(result).toEqual([]);
  });
});

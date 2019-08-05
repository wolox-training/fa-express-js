const request = require('supertest');
const app = require('../app');

const userCreate = {
  name: 'Joe',
  last_name: 'Doe',
  email: 'joedoe@wolox.co',
  password: 'holamundo2019'
};

const userParams = {
  name: '',
  last_name: 'Montoya',
  email: 'joedoe@wolox.co',
  password: 'holamundo'
};

const userPassword = {
  name: 'Felipe',
  last_name: 'Montoya',
  email: 'joedoe@wolox.co',
  password: 'holamundo'
};

describe('User creation', () => {
  it('Service responds with 200', async () => {
    await request(app)
      .post('/users')
      .send(userCreate)
      .expect(200);
  });

  it('Service responds with 400', async () => {
    await request(app)
      .post('/users')
      .send(userCreate);
    await request(app)
      .post('/users')
      .send(userCreate)
      .expect(400);
  });

  it('Service responds with 400 for bad password', async () => {
    await request(app)
      .post('/users')
      .send(userPassword)
      .expect(400);
  });

  it('Service responds with 400 for empty params', async () => {
    await request(app)
      .post('/users')
      .send(userParams)
      .expect(400);
  });
});

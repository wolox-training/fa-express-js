const request = require('supertest');
const app = require('../app');

const user = {
  name: 'Joe',
  last_name: 'Doe',
  email: 'joedoe@wolox.co',
  password: 'holamundo2019'
};

const user_params = {
  name: '',
  last_name: 'Montoya',
  email: 'joedoe@wolox.co',
  password: 'holamundo'
};

const user2 = {
  name: 'Felipe',
  last_name: 'Montoya',
  email: 'joedoe@wolox.co',
  password: 'holamundo2010'
};

describe('User', () => {
  it('Service responds with 200', async () => {
    await request(app)
      .post('/users')
      .send(user)
      .expect(200);
  });

  it('Service responds with 400', async () => {
    await request(app)
      .post('/users')
      .send(user);
    await request(app)
      .post('/users')
      .send(user2)
      .expect(400);
  });

  it('Service responds with 400 for bad password', async () => {
    const user_password = {
      name: 'Felipe',
      last_name: 'Montoya',
      email: 'joedoe@wolox.co',
      password: 'holamundo'
    };

    await request(app)
      .post('/users')
      .send(user_password)
      .expect(400);
  });

  it('Service responds with 400 for empty params', async () => {
    await request(app)
      .post('/users')
      .send(user_params)
      .expect(400);
  });
});

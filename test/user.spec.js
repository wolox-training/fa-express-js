const request = require('supertest');
const app = require('../app');

const user = {
  name: 'Joe',
  last_name: 'Doe',
  email: 'joedoe@wolox.co',
  password: 'holamundo2019'
};

describe('User Creation', () => {
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
      .send(user)
      .expect(400);
  });

  it('Service responds with 400 for bad password', async () => {
    await request(app)
      .post('/users')
      .send({ ...user, password: 'holamundo' })
      .expect(400);
  });

  it('Service responds with 400 for empty params', async () => {
    await request(app)
      .post('/users')
      .send({ ...user, name: '' })
      .expect(400);
  });
});

describe('Sign In', () => {
  const userSignIn = {
    email: 'joedoe@wolox.co',
    password: 'holamundo2019'
  };

  it('User signs-in correctly', async () => {
    await request(app)
      .post('/users')
      .send(user);

    await request(app)
      .post('/users/sessions')
      .send(userSignIn)
      .expect(200);
  });

  it('User signs-in with wrong password', async () => {
    await request(app)
      .post('/users/sessions')
      .send({ ...userSignIn, password: 'holamundo2018' })
      .expect(400);
  });

  it('User signs-in with unexisting email', async () => {
    await request(app)
      .post('/users/sessions')
      .send({ ...userSignIn, email: 'fmontoy@wolox.ar' })
      .expect(400);
  });
});

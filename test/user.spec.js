const request = require('supertest');
const app = require('../app');
const { User } = require('../app/models');
const { USER } = require('./constants');

describe('User Creation', () => {
  it('Service responds with 200 when user is created correctly', () =>
    request(app)
      .post('/users')
      .send(USER)
      .then(res => {
        expect(res.statusCode).toEqual(200);
        return User.findAll({ where: { email: USER.email } }).then(users => {
          expect(users.length).toEqual(1);
        });
      }));

  it('Service responds with 400 when the email exists', () =>
    request(app)
      .post('/users')
      .send(USER)
      .then(() =>
        request(app)
          .post('/users')
          .send(USER)
          .then(res => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Email must be unique');
          })
      ));

  it('Service responds with 400 for bad password', () =>
    request(app)
      .post('/users')
      .send({ ...USER, password: 'holamundo' })
      .then(res => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual(
          'The password must have letters and numbers and has to be at least 8 chars long'
        );
      }));

  it('Service responds with 400 for empty params in body', () =>
    request(app)
      .post('/users')
      .send({ ...USER, name: '' })
      .then(res => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('The name cannot be empty');
      }));
});

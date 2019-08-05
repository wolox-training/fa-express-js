const request = require('supertest');
const app = require('../app');
const { User } = require('../app/models');
const { USER } = require('./constants');

describe('User Creation', () => {
  it('Server responds with success when params are right and user is created correctly', () =>
    request(app)
      .post('/users')
      .send(USER)
      .then(res => {
        expect(res.statusCode).toEqual(200);
        return User.findAll({ where: { email: USER.email } }).then(users => {
          expect(users.length).toEqual(1);
        });
      }));

  it('Server responds with bad request error when the email exists in the database', () =>
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

  it('Server responds with bad request error for bad password (no number in password)', () =>
    request(app)
      .post('/users')
      .send({ ...USER, password: 'holamundo' })
      .then(res => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual(
          'The password must have letters and numbers and has to be at least 8 chars long'
        );
      }));

  it('Server responds with bad request error for empty params in body (name is empty)', () =>
    request(app)
      .post('/users')
      .send({ ...USER, name: '' })
      .then(res => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('The name cannot be empty');
      }));
});

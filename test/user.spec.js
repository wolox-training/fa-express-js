const request = require('supertest');
const app = require('../app');
const { User } = require('../app/models');
const { userTest } = require('./utils');
const lodash = require('lodash');

describe('User Creation', () => {
  it('Responds with success when params are right and user is created correctly', () =>
    request(app)
      .post('/users')
      .send(userTest)
      .then(res => {
        expect(res.statusCode).toEqual(200);
        return User.findOne({ where: { email: userTest.email } }).then(user => {
          expect(lodash.pick(user, ['name', 'last_name', 'email'])).toEqual(
            lodash.pick(userTest, ['name', 'last_name', 'email'])
          );
        });
      }));

  it('Responds with bad request error when the email exists in the database', () =>
    request(app)
      .post('/users')
      .send(userTest)
      .then(() =>
        request(app)
          .post('/users')
          .send(userTest)
          .then(res => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual('Email must be unique');
          })
      ));

  it('Responds with bad request error for bad password (no number in password)', () =>
    request(app)
      .post('/users')
      .send({ ...userTest, password: 'holamundo' })
      .then(res => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual(
          'The password must have letters and numbers and has to be at least 8 chars long'
        );
      }));

  it('Responds with bad request error for empty params in body (name is empty)', () =>
    request(app)
      .post('/users')
      .send({ ...userTest, name: '' })
      .then(res => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('The name cannot be empty');
      }));
});

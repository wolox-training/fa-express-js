const request = require('supertest');
const app = require('../app');
const { User } = require('../app/models');
const { user, signInData } = require('./utils');
const lodash = require('lodash');
const jwt = require('jwt-simple');
const {
  common: {
    session: { secret }
  }
} = require('../config');

describe('User Creation', () => {
  it('Responds with success when params are right and user is created correctly', () =>
    request(app)
      .post('/users')
      .send(user)
      .then(res => {
        expect(res.statusCode).toBe(200);
        return User.findOne({ where: { email: user.email } }).then(userData => {
          expect(lodash.pick(userData, ['name', 'last_name', 'email'])).toStrictEqual(
            lodash.pick(user, ['name', 'last_name', 'email'])
          );
        });
      }));

  it('Responds with bad request error when the email exists in the database', () =>
    request(app)
      .post('/users')
      .send(user)
      .then(() =>
        request(app)
          .post('/users')
          .send(user)
          .then(res => {
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Email must be unique');
          })
      ));

  it('Responds with bad request error for bad password (no number in password)', () =>
    request(app)
      .post('/users')
      .send({ ...user, password: 'holamundo' })
      .then(res => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe(
          'The password must have letters and numbers and has to be at least 8 chars long'
        );
      }));

  it('Responds with bad request error for empty params in body (name is empty)', () =>
    request(app)
      .post('/users')
      .send({ ...user, name: '' })
      .then(res => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('The name cannot be empty');
      }));
});

describe('User Sign-In', () => {
  it('Responds with success when the user is logged in with the correct credentials', () =>
    request(app)
      .post('/users')
      .send(user)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send(signInData)
          .then(res => {
            expect(res.statusCode).toBe(200);
            expect(jwt.decode(res.body.token, secret).email).toStrictEqual('joedoe@wolox.co');
          })
      ));

  it('Responds with bad request error when the email does not exists in the database', () =>
    request(app)
      .post('/users/sessions')
      .send(signInData)
      .then(res => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('No user with that email');
      }));

  it('Responds with bad request error for wrong password (passwords does not match)', () =>
    request(app)
      .post('/users')
      .send(user)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({ ...signInData, password: 'wrongpassword123' })
          .then(res => {
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Wrong password!');
          })
      ));
});

describe('List Users', () => {
  it('Responds with success when the auth token is valid and the user exists in the database', () =>
    request(app)
      .post('/users')
      .send(user)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send(signInData)
          .then(token =>
            request(app)
              .get('/users')
              .set('authorization', `Bearer ${token}`)
              .then(response => {
                expect(response.status).toBe(200);
                expect(response.body.users.length).toBe(1);
              })
          )
      ));
});

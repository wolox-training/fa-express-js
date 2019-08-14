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
const { createManyUsers, buildUser, extendUser, createUser } = require('./utils');
const { findUser } = require('../app/services/users');

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
        expect(res.body.message).toBe('There is no user with that email');
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
              .set('authorization', token.body.token)
              .then(response => {
                expect(response.status).toBe(200);
                expect(response.body.users[0]).toStrictEqual(
                  lodash.pick(user, ['email', 'name', 'last_name'])
                );
              })
          )
      ));

  it('Responds with bad request if the token is invalid', () =>
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
              .set('authorization', `${token.body.token}invalid`)
              .then(response => {
                expect(response.status).toBe(401);
                expect(response.body.message).toBe('Signature verification failed');
              })
          )
      ));

  it('Responds with bad request if the payload of the token is an user that does not exist', () =>
    request(app)
      .post('/users')
      .send(user)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send(signInData)
          .then(token =>
            User.destroy({ where: { email: user.email } }).then(() =>
              request(app)
                .get('/users')
                .set('authorization', `${token.body.token}`)
                .then(response => {
                  expect(response.status).toBe(401);
                  expect(response.body.message).toBe('Invalid Token');
                })
            )
          )
      ));

  it('Responds with success, body with two pages and six users per page', () =>
    request(app)
      .post('/users')
      .send(user)
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send(signInData)
          .then(token =>
            createManyUsers(10).then(() =>
              request(app)
                .get('/users')
                .set('authorization', token.body.token)
                .then(response => {
                  expect(response.status).toBe(200);
                  expect(response.body.pages).toBe(2);
                  expect(response.body.users.length).toBe(6);
                })
            )
          )
      ));
});

describe('Sign-up an user with admin permissions', () => {
  it(`Responds with success when the auth token is valid for admin 
  requests and creates a new user with admin permissions`, () => {
    extendUser('adminUser', { admin: true });
    return createUser('adminUser').then(admin => {
      const token = jwt.encode({ email: admin.dataValues.email, admin: admin.dataValues.admin }, secret);
      return request(app)
        .post('/admin/users')
        .send(user)
        .set('authorization', token)
        .then(response =>
          findUser({ email: user.email }).then(foundUser => {
            expect(response.status).toBe(200);
            expect(foundUser.dataValues.admin).toBe(true);
          })
        );
    });
  });

  it('Responds with unauthorized when user is not admin', () =>
    buildUser().then(({ dataValues }) =>
      request(app)
        .post('/users')
        .send(dataValues)
        .then(() =>
          request(app)
            .post('/users/sessions')
            .send({ email: dataValues.email, password: dataValues.password })
            .then(token =>
              request(app)
                .post('/admin/users')
                .send(user)
                .set('authorization', token.body.token)
                .then(response => {
                  expect(response.status).toBe(401);
                  expect(response.body.message).toBe('You dont have permissions for this request');
                })
            )
        )
    ));

  it('Responds with success when token is valid and updates the admin value of the user created if it exists', () =>
    createUser('adminUser').then(admin => {
      const token = jwt.encode({ email: admin.dataValues.email, admin: admin.dataValues.admin }, secret);
      return request(app)
        .post('/users')
        .send(user)
        .then(() =>
          request(app)
            .post('/admin/users')
            .send(user)
            .set('authorization', token)
            .then(response =>
              findUser({ email: user.email }).then(newAdmin => {
                expect(response.status).toBe(200);
                expect(newAdmin.dataValues.admin).toBe(true);
              })
            )
        );
    }));
});

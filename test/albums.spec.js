const request = require('supertest');
const app = require('../app');
const { createUser } = require('./utils');
const jwt = require('jwt-simple');
const {
  common: {
    session: { secret }
  }
} = require('../config');
const { getPurchasedAlbums } = require('../app/services/albums');

describe('Purchase Albums', () => {
  it('Responds with success when user buys an album', () =>
    createUser().then(user => {
      const token = jwt.encode({ email: user.dataValues.email, role: user.dataValues.role }, secret);
      return request(app)
        .post('/albums/1')
        .set('authorization', token)
        .then(response =>
          getPurchasedAlbums({ user: user.email }).then(purchasedAlbums => {
            expect(response.status).toBe(200);
            expect(purchasedAlbums[0].user).toBe(user.email);
            expect(purchasedAlbums[0].album).toBe(1);
          })
        );
    }));

  it('Responds with bad request when user buys the album two times', () =>
    createUser().then(user => {
      const token = jwt.encode({ email: user.dataValues.email, role: user.dataValues.role }, secret);
      return request(app)
        .post('/albums/1')
        .set('authorization', token)
        .then(() =>
          request(app)
            .post('/albums/1')
            .set('authorization', token)
            .then(res => {
              expect(res.status).toBe(400);
              expect(res.body.message).toBe('You have bought this book');
            })
        );
    }));

  it('Responds with success when two users buy the same album', () =>
    createUser().then(user => {
      const token = jwt.encode({ email: user.dataValues.email, role: user.dataValues.role }, secret);
      return request(app)
        .post('/albums/1')
        .set('authorization', token)
        .then(() =>
          createUser().then(user2 => {
            const token2 = jwt.encode({ email: user2.dataValues.email, role: user2.dataValues.role }, secret);
            return request(app)
              .post('/albums/1')
              .set('authorization', token2)
              .then(response =>
                getPurchasedAlbums({ album: 1 }).then(purchasedAlbums => {
                  expect(response.status).toBe(200);
                  expect(purchasedAlbums[0].dataValues.user).toBe(user.email);
                  expect(purchasedAlbums[1].dataValues.user).toBe(user2.email);
                  expect(purchasedAlbums[1].dataValues.album).toBe(response.body.albumPurchased.album);
                  expect(purchasedAlbums[0].dataValues.album).toBe(response.body.albumPurchased.album);
                })
              );
          })
        );
    }));
});

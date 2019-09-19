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
          getPurchasedAlbums({ userId: user.id }).then(([albums0]) => {
            expect(response.status).toBe(200);
            expect(albums0.userId).toBe(user.id);
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
                getPurchasedAlbums({ albumId: 1 }).then(([album0, album1]) => {
                  expect(response.status).toBe(200);
                  expect(album0.dataValues.userId).toBe(user.id);
                  expect(album1.dataValues.userId).toBe(user2.id);
                  expect(album0.dataValues.albumId).toBe(response.body.albumPurchased.albumId);
                  expect(album1.dataValues.albumId).toBe(response.body.albumPurchased.albumId);
                })
              );
          })
        );
    }));
});

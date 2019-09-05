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
});

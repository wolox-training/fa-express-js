const request = require('supertest');
const app = require('../app');

describe('Health', () => {
  it('Service responds with 200', async () => {
    await request(app)
      .get('/health')
      .expect(200);
  });
});

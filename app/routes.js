const { healthCheck } = require('./controllers/healthCheck');
const { listAlbums, getPhotos } = require('./controllers/albums');
const { createUser } = require('./controllers/users');
const { userSchema } = require('./schemas/user');
const { validateSchema } = require('./middlewares/schema_validation');
exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', listAlbums);
  app.get('/albums/:id/photos', getPhotos);
  app.post('/users', [validateSchema(userSchema)], createUser);
};

const { healthCheck } = require('./controllers/healthCheck');
const { listAlbums, getPhotos } = require('./controllers/albums');
const { createUser, signIn, listUsers, createAdmin } = require('./controllers/users');
const { userSchema, signInSchema, adminSchema } = require('./schemas/user');
const { validateSchema } = require('./middlewares/schema_validation');
const { checkSession, checkAdmin } = require('./middlewares/session_validation');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', listAlbums);
  app.get('/albums/:id/photos', getPhotos);
  app.post('/users/sessions', [validateSchema(signInSchema)], signIn);
  app.post('/users', [validateSchema(userSchema)], createUser);
  app.get('/users', checkSession, listUsers);
  app.post('/admin/users', [validateSchema(adminSchema), checkSession, checkAdmin], createAdmin);
};

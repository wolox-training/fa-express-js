// const controller = require('./controllers/controller');
const { healthCheck } = require('./controllers/healthCheck');
const { listAlbums, getPhotos } = require('./controllers/albums');
const { setUser } = require('./controllers/users');
exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', listAlbums);
  app.get('/albums/:id/photos', getPhotos);
  app.post('/users', setUser);
};

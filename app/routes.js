// const controller = require('./controllers/controller');
const { healthCheck } = require('./controllers/healthCheck');
const { listAlbums } = require('./controllers/albums');
exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', listAlbums);
};

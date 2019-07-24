const { getAlbums } = require('../services/albums');

exports.listAlbums = () => {
  getAlbums();
};

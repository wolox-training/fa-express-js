const axios = require('axios');
const errors = require('../errors');
const config = require('../../config');
exports.getAlbums = () => axios.get(`${config.common.api.albumsBaseUrl}albums/`);

exports.getPhotos = id =>
  axios
    .get(`${config.common.api.albumsBaseUrl}albums/${id}/photos`)
    .catch(() => Promise.reject(errors.defaultError('Server is unavailable')));

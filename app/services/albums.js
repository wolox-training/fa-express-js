const axios = require('axios');
const errors = require('../errors');
const {
  common: {
    api: { albumsBaseUrl }
  }
} = require('../../config');

exports.getAlbums = () => axios.get(`${albumsBaseUrl}albums/`);

exports.getPhotos = id =>
  axios
    .get(`${albumsBaseUrl}albums/${id}/photos`)
    .catch(() => Promise.reject(errors.defaultError('Server is unavailable')));

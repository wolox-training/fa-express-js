const axios = require('axios');
const errors = require('../errors');

exports.getAlbums = () => axios.get(`${process.env.ALBUMS_URL}albums/`);

exports.getPhotos = id =>
  axios
    .get(`${process.env.ALBUMS_URL}albums/${id}/photos`)
    .then(response => Promise.resolve(response))
    .catch(() => Promise.reject(errors.badRequestError('Server is unavailable')));

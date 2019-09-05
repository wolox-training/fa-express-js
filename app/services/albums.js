const axios = require('axios');
const errors = require('../errors');
const AlbumsPurchase = require('../models');
const {
  common: {
    api: { albumsBaseUrl }
  }
} = require('../../config');
const logger = require('../logger');

exports.getAlbums = (id = '') => axios.get(`${albumsBaseUrl}albums/${id}`);

exports.getPhotos = id =>
  axios
    .get(`${albumsBaseUrl}albums/photos?albumId=${id}`)
    .catch(() => Promise.reject(errors.defaultError('Server is unavailable')));

exports.getPurchasedAlbums = params => AlbumsPurchase.findAll({ where: params });

exports.purchaseAlbum = (album, user, albumName) =>
  AlbumsPurchase.create({ album, user, album_name: albumName }).catch(err => {
    logger.error(err.message);
    Promise.reject(errors.databaseError());
  });

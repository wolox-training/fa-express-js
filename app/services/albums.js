const axios = require('axios');
const errors = require('../errors');
const { AlbumsPurchases } = require('../models');
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

exports.getPurchasedAlbums = params =>
  AlbumsPurchases.findAll({ where: params }).catch(err => {
    logger.error(err.message);
    return Promise.reject(errors.databaseError());
  });

exports.purchaseAlbum = (album, user, albumName) =>
  AlbumsPurchases.create({ album, user, album_name: albumName }).catch(err => {
    logger.error(err.message);
    return Promise.reject(errors.databaseError());
  });

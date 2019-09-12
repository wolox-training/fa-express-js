const axios = require('axios');
const errors = require('../errors');
const { AlbumsPurchases } = require('../models');
const {
  common: {
    api: { albumsBaseUrl }
  }
} = require('../../config');
const logger = require('../logger');

exports.getAlbumsById = id => axios.get(`${albumsBaseUrl}albums/${id}`);

exports.getAlbums = () => axios.get(`${albumsBaseUrl}albums`);

exports.getPhotos = id =>
  axios
    .get(`${albumsBaseUrl}albums/photos`, { query: { id } })
    .catch(() => Promise.reject(errors.defaultError('Server is unavailable')));

exports.getPurchasedAlbums = params =>
  AlbumsPurchases.findAll({ where: params }).catch(err => {
    logger.error(err.message);
    return Promise.reject(errors.databaseError());
  });

exports.purchaseAlbum = purchase =>
  AlbumsPurchases.create(purchase).catch(err => {
    logger.error(err.message);
    return Promise.reject(errors.databaseError());
  });

const { getAlbums, getPhotos, getPurchasedAlbums, purchaseAlbum } = require('../services/albums');
const { filterAlbumById } = require('../utils/helpers');
const errors = require('../errors');

exports.listAlbums = (req, res, next) =>
  getAlbums()
    .then(response => res.send(response.data))
    .catch(next);

exports.getPhotos = (req, res, next) =>
  getPhotos(req.params.id)
    .then(response => {
      const photos = filterAlbumById(response.data, req.params.id);
      return res.send(photos);
    })
    .catch(next);

exports.buyAlbum = (req, res, next) =>
  getAlbums(req.params.id)
    .then(album => {
      const { user } = res.locals;
      return getPurchasedAlbums({ user: user.email, album: req.params.id })
        .then(albums => {
          if (albums) {
            return Promise.reject(errors.badRequestError('You have bought this book'));
          }
          return purchaseAlbum(req.params.id, user, album)
            .then(albumPurchased => res.send({ albumPurchased }))
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);

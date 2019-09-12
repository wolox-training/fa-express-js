const {
  getAlbums,
  getPhotos,
  getPurchasedAlbums,
  purchaseAlbum,
  getAlbumsById
} = require('../services/albums');
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

exports.buyAlbum = (req, res, next) => {
  const { user } = res.locals;
  return getPurchasedAlbums({ id: `${user.id}${req.params.id}` })
    .then(albums => {
      if (albums.length > 0) {
        return Promise.reject(errors.badRequestError('You have bought this book'));
      }
      return getAlbumsById(req.params.id).then(album =>
        purchaseAlbum({
          id: `${user.id}${req.params.id}`,
          userId: user.id,
          albumId: album.data.id,
          album_name: album.data.title
        }).then(albumPurchased => res.send({ albumPurchased }))
      );
    })
    .catch(next);
};

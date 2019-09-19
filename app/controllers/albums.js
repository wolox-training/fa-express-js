const {
  getAlbums,
  getPhotos,
  getPurchasedAlbums,
  purchaseAlbum,
  getAlbumsById
} = require('../services/albums');
const errors = require('../errors');

exports.listAlbums = (req, res, next) =>
  getAlbums()
    .then(response => res.send(response.data))
    .catch(next);

exports.getPhotos = (req, res, next) =>
  getPhotos(req.params.id)
    .then(response => res.send(response))
    .catch(next);

exports.buyAlbum = (req, res, next) => {
  const { user } = res.locals;
  return getPurchasedAlbums({ userId: user.id })
    .then(albums => {
      if (albums.length > 0) {
        return Promise.reject(errors.badRequestError('You have bought this book'));
      }
      return getAlbumsById(req.params.id).then(album =>
        purchaseAlbum({
          userId: user.id,
          albumId: album.data.id,
          albumName: album.data.title
        }).then(albumPurchased => res.send({ albumPurchased }))
      );
    })
    .catch(next);
};

const { getAlbums, getPhotos } = require('../services/albums');

exports.listAlbums = (req, res, next) => {
  getAlbums()
    .then(response => res.status(200).send(response.data))
    .catch(error => next(error));
};

exports.getPhotos = (req, res, next) => {
  getPhotos(req.params.id)
    .then(response => {
      const photos = response.data.filter(album => album.albumId.toString() === req.params.id);
      res.status(200).send(photos);
    })
    .catch(error => next(error));
};

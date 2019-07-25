const { getAlbums, getPhotos } = require('../services/albums');

exports.listAlbums = (req, res, next) =>
  getAlbums()
    .then(response => res.send(response.data))
    .catch(next);

exports.getPhotos = (req, res, next) =>
  getPhotos(req.params.id)
    .then(response => {
      const photos = response.data.filter(album => album.albumId.toString() === req.params.id);
      return res.send(photos);
    })
    .catch(next);

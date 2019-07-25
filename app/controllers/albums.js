const { getAlbums, getPhotos } = require('../services/albums');

exports.listAlbums = async (req, res) => {
  const response = await getAlbums();
  res.status(200).send(response.data);
};

exports.getPhotos = async (req, res) => {
  const response = await getPhotos(req.params.id);
  const photos = response.data.filter(album => album.albumId.toString() === req.params.id);
  res.status(200).send(photos);
};

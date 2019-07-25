const { getAlbums } = require('../services/albums');

exports.listAlbums = async (req, res) => {
  const response = await getAlbums();
  res.status(200).send(response.data);
};

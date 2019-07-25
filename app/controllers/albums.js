const { getAlbums } = require('../services/albums');

exports.listAlbums = async (req, res) => {
  let response = await getAlbums()
  res.status(200).send(response.data);
};

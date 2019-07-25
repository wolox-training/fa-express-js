const axios = require('axios');
const errors = require('../errors');
exports.getAlbums = () => axios.get('https://jsonplaceholder.typicode.com/albums');
exports.getPhotos = async () => {
  try {
    const response = await axios.get('https://jsonplaceholderholi.typicode.com/albums/photos');
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(errors.badRequestError('Server is unavailable'));
  }
};

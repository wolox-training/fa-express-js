const axios = require('axios');

exports.getAlbums = () => axios.get('https://jsonplaceholder.typicode.com/albums');
exports.getPhotos = id => axios.get(`https://jsonplaceholder.typicode.com/albums/${id}/photos`);

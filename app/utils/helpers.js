const errors = require('../errors');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const logger = require('../logger');
const {
  common: {
    session: { secret }
  }
} = require('../../config');

exports.validatePassword = (dbUser, user) =>
  bcrypt
    .compare(user.password, dbUser.password)
    .then(passwordExists => {
      if (!passwordExists) {
        return Promise.reject(errors.badRequestError('Wrong password!'));
      }
      logger.info('User exists and passwords are matching');
      const token = jwt.encode({ email: user.email, role: dbUser.role }, secret);
      return Promise.resolve({ token });
    })
    .catch(error => Promise.reject(errors.badRequestError(error.message)));

exports.decodeJwt = token => {
  try {
    return jwt.decode(token, secret);
  } catch (error) {
    throw errors.unauthorizedError(error.message);
  }
};

exports.filterAlbumById = (albums, id) => albums.filter(album => album.albumId.toString() === id);

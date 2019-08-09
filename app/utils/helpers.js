const errors = require('../errors');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const logger = require('../logger');
const {
  common: {
    session: { secret }
  }
} = require('../../config');

exports.validatePassword = (dbPassword, user) =>
  bcrypt
    .compare(user.password, dbPassword)
    .then(passwordExists => {
      if (!passwordExists) {
        return Promise.reject(errors.badRequestError('Wrong password!'));
      }
      logger.info('User exists and passwords are matching');
      const token = jwt.encode({ username: user.email }, secret);
      return Promise.resolve({ token });
    })
    .catch(error => Promise.reject(errors.badRequestError(error.message)));

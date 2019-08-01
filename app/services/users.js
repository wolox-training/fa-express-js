const { User } = require('../models');
const errors = require('../errors');
const bcrypt = require('bcryptjs');
const { SALTROUNDS } = require('../constants');
const logger = require('../logger');
exports.createUser = user =>
  bcrypt.hash(user.password, SALTROUNDS).then(hash => {
    user.password = hash;
    return User.create(user).catch(error => Promise.reject(errors.databaseError(error.message)));
  });

exports.signInUser = signData => {
  logger.info('Trying to sign-in the user...');
  return User.findOne({
    where: {
      email: signData.email
    }
  })
    .then(user => {
      if (user) {
        return bcrypt
          .compare(signData.password, user.password)
          .then(res => {
            if (res) {
              logger.info('User exists and passwords are matching');
              return Promise.resolve();
            }
            return Promise.reject(errors.badRequestError('Wrong password!'));
          })
          .catch(error => Promise.reject(errors.badRequestError(error.message)));
      }
      logger.error('Email does not exists');
      return Promise.reject(errors.badRequestError('No user with that email'));
    })
    .catch(error => Promise.reject(errors.badRequestError(error.message)));
};

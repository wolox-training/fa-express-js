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

exports.signInUser = ({ email, password }) => {
  logger.info('Trying to sign-in the user');
  return User.findOne({
    where: {
      email
    }
  })
    .then(user => {
      if (user) {
        return bcrypt
          .compare(password, user.password)
          .then(res => {
            if (!res) {
              throw errors.badRequestError('Wrong password!');
            }
            logger.info('User exists and passwords are matching');
          })
          .catch(error => {
            throw errors.badRequestError(error.message);
          });
      }
      logger.error('Email does not exists');
      throw errors.badRequestError('No user with that email');
    })
    .catch(error => {
      logger.error(`Database Error: ${error.message}`);
      throw errors.databaseError(error.message);
    });
};

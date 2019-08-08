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

exports.signInUser = ({ email }) => {
  logger.info(`Trying to sign-in the user with email: ${email}`);
  return User.findOne({
    where: {
      email
    }
  });
};

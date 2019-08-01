const { User } = require('../models');
const errors = require('../errors');
const bcrypt = require('bcrypt');
const { SALTROUNDS } = require('../constants');

exports.createUser = user =>
  bcrypt.hash(user.password, SALTROUNDS).then(hash => {
    user.password = hash;
    return User.create(user).catch(error => Promise.reject(errors.databaseError(error.message)));
  });

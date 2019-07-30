const { User } = require('../models');
const errors = require('../errors');
const bcrypt = require('bcrypt');

exports.setUser = user =>
  bcrypt.hash(user.password, 10).then(hash => {
    user.password = hash;
    return User.create(user).catch(error => Promise.reject(errors.databaseError(error.message)));
  });

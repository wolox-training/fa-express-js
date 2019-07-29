const { User } = require('../models');
const errors = require('../errors');

exports.setUser = user =>
  User.create(user).catch(error => Promise.reject(errors.databaseError(error.message)));

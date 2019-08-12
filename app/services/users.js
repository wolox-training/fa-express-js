const { User } = require('../models');
const errors = require('../errors');
const bcrypt = require('bcryptjs');
const { SALTROUNDS } = require('../constants');

exports.createUser = user =>
  bcrypt.hash(user.password, SALTROUNDS).then(hash => {
    user.password = hash;
    return User.create(user).catch(error => Promise.reject(errors.databaseError(error.message)));
  });

exports.findUser = params =>
  User.findOne({
    where: {
      ...params
    }
  }).then(user => {
    if (user) {
      return Promise.resolve(user);
    }
    return Promise.reject(errors.badRequestError('No user with that email'));
  });

exports.getUsers = (page, limit) => {
  const offset = page * limit;
  console.log(limit);
  return User.findAndCountAll({
    limit,
    offset,
    attributes: ['name', 'last_name', 'email']
  });
};

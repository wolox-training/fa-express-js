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
    where: params
  }).catch(error => {
    throw errors.databaseError(error.message);
  });

exports.getUsers = (offset, limit) =>
  User.findAndCountAll({
    limit,
    offset,
    attributes: ['name', 'last_name', 'email']
  });

exports.updateUser = (user, updateParams) => user.update(updateParams);

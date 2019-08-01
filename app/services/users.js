const { User } = require('../models');
const errors = require('../errors');
const bcrypt = require('bcryptjs');
const { SALTROUNDS } = require('../constants');

exports.createUser = user =>
  bcrypt.hash(user.password, SALTROUNDS).then(hash => {
    user.password = hash;
    return User.create(user).catch(error => Promise.reject(errors.databaseError(error.message)));
  });

exports.signInUser = signData =>
  User.findOne({
    where: {
      email: signData.email
    }
  })
    .then(user => {
      if (user) {
        return bcrypt
          .compare(signData.password, user.password)
          .then(res => (res ? Promise.resolve() : Promise.reject(errors.badRequestError('Wrong password!'))))
          .catch(error => Promise.reject(errors.badRequestError(error.message)));
      }
      return Promise.reject(errors.badRequestError('No user with that email'));
    })
    .catch(error => Promise.reject(errors.badRequestError(error.message)));

const { createUser, findUser } = require('../services/users');
const lodash = require('lodash');
const logger = require('../logger');
const { validatePassword } = require('../utils/helpers');
const errors = require('../errors');

exports.createUser = (req, res, next) =>
  createUser(req.body)
    .then(user => res.send(lodash.pick(user, ['name', 'last_name', 'email'])))
    .catch(next);

exports.signIn = (req, res, next) =>
  findUser({ email: req.body.email })
    .then(user => {
      if (user) {
        logger.info(`Trying to sign-in the user with email: ${user.email}`);
        return validatePassword(user.password, req.body)
          .then(token => res.send(token))
          .catch(error => {
            throw errors.badRequestError(error.message);
          });
      }
      throw errors.badRequestError('There is no user with that email');
    })
    .catch(next);

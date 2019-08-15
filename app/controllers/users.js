const { createUser, findUser, getUsers, updateUser } = require('../services/users');
const lodash = require('lodash');
const logger = require('../logger');
const { validatePassword } = require('../utils/helpers');
const errors = require('../errors');
const { PAGESIZE, FIRSTPAGE } = require('../constants');

exports.createUser = (req, res, next) =>
  createUser(req.body)
    .then(user => res.send(lodash.pick(user, ['name', 'last_name', 'email'])))
    .catch(next);

exports.signIn = (req, res, next) =>
  findUser({ email: req.body.email })
    .then(user => {
      if (user) {
        logger.info(`Trying to sign-in the user with email: ${user.email}`);
        return validatePassword(user, req.body)
          .then(token => res.send(token))
          .catch(error => {
            throw errors.badRequestError(error.message);
          });
      }
      throw errors.badRequestError('There is no user with that email');
    })
    .catch(next);

exports.listUsers = (req, res, next) => {
  const limit = req.query.limit || PAGESIZE;
  const page = req.query.page || FIRSTPAGE;
  const offset = page * limit;
  return getUsers(offset, limit)
    .then(({ count, rows }) => res.send({ pages: Math.ceil(count / limit), users: rows }))
    .catch(error => next(errors.databaseError(error.message)));
};

exports.createAdmin = (req, res, next) => {
  findUser({ email: req.body.email })
    .then(user => {
      if (user) {
        updateUser(user, { ...req.body, admin: true })
          .then(updatedUser => res.send(lodash.pick(updatedUser, ['name', 'last_name', 'email', 'admin'])))
          .catch(error => next(errors.badRequestError(error.message)));
      } else {
        createUser({ ...req.body, admin: true })
          .then(adminUser => res.send(lodash.pick(adminUser, ['name', 'last_name', 'email', 'admin'])))
          .catch(error => next(errors.badRequestError(error.message)));
      }
    })
    .catch(error => next(error.badRequestError(error.message)));
};

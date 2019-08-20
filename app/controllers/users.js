const { createUser, findUser, getUsers, updateUser } = require('../services/users');
const lodash = require('lodash');
const logger = require('../logger');
const { validatePassword } = require('../utils/helpers');
const errors = require('../errors');
const { PAGESIZE, FIRSTPAGE, ROLES } = require('../constants');
const pick = (user, params = ['name', 'last_name', 'email', 'role']) => lodash.pick(user, params);
exports.createUser = (req, res, next) =>
  createUser(req.body)
    .then(user => res.send(pick(user)))
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

exports.createAdminUser = (req, res, next) =>
  findUser({ email: req.body.email })
    .then(user => {
      if (user) {
        logger.info('User exists, updating values and setting admin permissions to true');
        return updateUser(user, { role: ROLES.admin })
          .then(updatedUser => res.send(pick(updatedUser)))
          .catch(error => next(errors.badRequestError(error.message)));
      }
      logger.info('User does not exist, creating a new admin user');
      return createUser({ ...req.body, role: ROLES.admin })
        .then(adminUser => res.send(lodash.pick(adminUser)))
        .catch(error => next(errors.badRequestError(error.message)));
    })
    .catch(error => next(error.badRequestError(error.message)));

const { createUser, findUser, getUsers } = require('../services/users');
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
        return validatePassword(user.password, req.body)
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
    .then(users => res.send({ pages: Math.ceil(users.count / limit), users: users.rows }))
    .catch(error => next(errors.databaseError(error.message)));
};

const { createUser, findUser, getUsers } = require('../services/users');
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
      logger.info(`Trying to sign-in the user with email: ${user.email}`);
      return validatePassword(user.password, req.body)
        .then(token => res.send(token))
        .catch(next);
    })
    .catch(next);

exports.listUsers = (req, res, next) => {
  getUsers(req.query.page - 1, req.query.limit)
    .then(users => {
      res.send({ pages: Math.ceil(users.count / req.query.limit), users: users.rows });
    })
    .catch(error => next(errors.databaseError(error.message)));
};

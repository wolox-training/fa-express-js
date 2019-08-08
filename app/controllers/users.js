const { createUser, signInUser } = require('../services/users');
const jwt = require('jwt-simple');
const lodash = require('lodash');
const logger = require('../logger');
const {
  common: {
    session: { secret }
  }
} = require('../../config');
const errors = require('../errors');
const bcrypt = require('bcryptjs');

exports.createUser = (req, res, next) =>
  createUser(req.body)
    .then(user => res.send(lodash.pick(user, ['name', 'last_name', 'email'])))
    .catch(next);

exports.signIn = (req, res, next) =>
  signInUser(req.body)
    .then(user => {
      if (user) {
        return bcrypt
          .compare(req.body.password, user.password)
          .then(passwordExists => {
            if (!passwordExists) {
              next(errors.badRequestError('Wrong password!'));
            }
            logger.info('User exists and passwords are matching');
            const token = jwt.encode({ username: req.body.email }, secret);
            return res.send({ token });
          })
          .catch(error => next(errors.badRequestError(error.message)));
      }
      logger.error('Email does not exists');
      return next(errors.badRequestError('No user with that email'));
    })
    .catch(error => {
      logger.error(`Database Error: ${error.message}`);
      return next(errors.databaseError(error.message));
    });

const errors = require('../errors');
const jwt = require('jwt-simple');
const {
  common: {
    session: { secret }
  }
} = require('../../config');
const { findUser } = require('../services/users');

exports.checkSession = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace('Bearer ', '');
    findUser({ email: jwt.decode(token, secret).email }).catch(next);
    return next();
  }
  return next(errors.unauthorizedError('No valid token'));
};

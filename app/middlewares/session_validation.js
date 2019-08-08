const errors = require('../errors');
const jwt = require('jwt-simple');
const {
  common: {
    session: { secret }
  }
} = require('../../config');
const { signInUser } = require('../services/users');

exports.checkSession = (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  console.log(token);
  if (token) {
    signInUser(jwt.decode(token, secret)).then(user => user);
    return next();
  }
  return next(errors.unauthorizedError('No valid token'));
};

const errors = require('../errors');
const jwt = require('jwt-simple');
const {
  common: {
    session: { secret }
  }
} = require('../../config');
const { findUser } = require('../services/users');

exports.checkSession = (req, _, next) => {
  const token = req.headers.authorization;
  try {
    if (token) {
      const { email } = jwt.decode(token, secret);
      if (email) {
        return findUser({ email }).then(user =>
          user ? next() : next(errors.unauthorizedError('Invalid Token'))
        );
      }
      return next(errors.unauthorizedError('Invalid Token'));
    }
    throw next(errors.unauthorizedError('Invalid Token'));
  } catch (error) {
    return next(errors.unauthorizedError(error.message));
  }
};

exports.checkAdmin = (req, _, next) => {
  const token = req.headers.authorization;
  try {
    const { admin } = jwt.decode(token, secret);
    if (admin) {
      next();
    } else {
      next(errors.unauthorizedError('You dont have permissions for this request'));
    }
  } catch (error) {
    next(errors.unauthorizedError(error.message));
  }
};

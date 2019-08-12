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
        findUser({ email }).then(user => (user ? next() : next(errors.unauthorizedError('Invalid Token'))));
      }
    } else {
      throw errors.unauthorizedError('Invalid Token');
    }
  } catch (error) {
    next(errors.unauthorizedError(error.message));
  }
};

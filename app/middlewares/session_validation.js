const errors = require('../errors');
const jwt = require('jwt-simple');
const {
  common: {
    session: { secret }
  }
} = require('../../config');
const { findUser } = require('../services/users');

exports.checkSession = async (req, _, next) => {
  const token = req.headers.authorization;
  try {
    if (token) {
      const { email } = jwt.decode(token, secret);
      if (email) {
        const user = await findUser({ email });
        if (user) {
          return next();
        }
        return next(errors.unauthorizedError('Invalid Token'));
      }
      return next(errors.unauthorizedError('Invalid Token'));
    }
    return next(errors.unauthorizedError('Invalid Token'));
  } catch (error) {
    return error.internal_code === 'database_error'
      ? next(error)
      : next(errors.unauthorizedError(error.message));
  }
};

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
        throw errors.unauthorizedError('Invalid Token');
      }
      throw errors.unauthorizedError('Invalid Token');
    }
    throw errors.unauthorizedError('Invalid Token');
  } catch (error) {
    return next(errors.unauthorizedError(error.message));
  }
};

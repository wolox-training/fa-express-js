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

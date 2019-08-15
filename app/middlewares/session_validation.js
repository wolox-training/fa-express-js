const errors = require('../errors');
const { findUser } = require('../services/users');
const { decodeJwt } = require('../utils/helpers');

exports.checkSession = async (req, _, next) => {
  const token = req.headers.authorization;
  try {
    if (token) {
      const { email } = decodeJwt(token);
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
    return next(error);
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

const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.UNAUTHORIZED = 'unauthorized_error';
exports.unauthorizedError = message => internalError(message, exports.UNAUTHORIZED);

exports.BAD_REQUEST = 'bad_request';
exports.badRequestError = message => internalError(message, exports.BAD_REQUEST);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

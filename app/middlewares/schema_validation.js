const { checkSchema, validationResult } = require('express-validator/check');
const errors = require('../errors');

const checkValidationResult = (req, res, next) => {
  const error = validationResult(req).errors.map(err => err.msg);
  return validationResult(req).isEmpty() ? next() : next(errors.badRequestError(error));
};

const validate = schema => checkSchema(schema);

exports.validateSchema = schema => [validate(schema), checkValidationResult];

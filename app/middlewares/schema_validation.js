const { checkSchema, validationResult } = require('express-validator/check');
const errors = require('../errors');

const checkValidationResult = (req, res, next) => {
  const validationErrors = validationResult(req)
    .errors.map(err => err.msg.message)
    .toString();
  return validationResult(req).isEmpty() ? next() : next(errors.badRequestError(validationErrors));
};

const validate = schema => checkSchema(schema);

exports.validateSchema = schema => [validate(schema), checkValidationResult];

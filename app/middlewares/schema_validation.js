const { checkSchema, validationResult } = require('express-validator/check');

const errors = require('../errors');

const checkValidationResult = (req, res, next) =>
  validationResult(req).isEmpty()
    ? next()
    : next(errors.badRequestError(validationResult(req).errors[0].msg));

const validate = schema => checkSchema(schema);

exports.validateSchema = schema => [validate(schema), checkValidationResult];

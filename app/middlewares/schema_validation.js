const { checkSchema, validationResult } = require('express-validator/check');

const checkValidationResult = (req, res, next) =>
  validationResult(req).isEmpty() ? next() : next(validationResult(req).errors[0].msg);
const validate = schema => checkSchema(schema);

exports.validateSchema = schema => [validate(schema), checkValidationResult];

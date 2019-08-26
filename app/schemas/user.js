const { User } = require('../models');
const errors = require('../errors');

exports.userSchema = {
  email: {
    in: ['body'],
    matches: {
      options: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@wolox.([A-Za-z])+$/,
      errorMessage: errors.badRequestError('The email must have the wolox domain')
    },
    custom: {
      options: value =>
        User.findAll({ where: { email: value } }).then(users =>
          users.length > 0
            ? Promise.reject(errors.badRequestError('Email must be unique'))
            : Promise.resolve()
        )
    }
  },
  password: {
    in: ['body'],
    matches: {
      options: /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
      errorMessage: errors.badRequestError(
        'The password must have letters and numbers and has to be at least 8 chars long'
      )
    }
  },

  name: {
    in: ['body'],
    isLength: {
      errorMessage: errors.badRequestError('The name cannot be empty'),
      options: { min: 2 }
    }
  },

  last_name: {
    in: ['body'],
    isLength: {
      errorMessage: errors.badRequestError('The last name cannot be empty'),
      options: { min: 2 }
    }
  }
};

exports.signInSchema = {
  email: {
    in: ['body'],
    matches: {
      options: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@wolox.([A-Za-z])+$/,
      errorMessage: errors.badRequestError('The email must have the wolox domain')
    },

    isLength: {
      options: { min: 9 },
      errorMessage: errors.badRequestError('The email cannot be less than 9 characters')
    }
  },

  password: {
    in: ['body'],
    matches: {
      options: /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
      errorMessage: errors.badRequestError(
        'The password must have letters and numbers and has to be at least 8 chars long'
      )
    }
  }
};

exports.adminSchema = {
  ...exports.userSchema,
  email: {
    in: ['body'],
    matches: {
      options: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@wolox.([A-Za-z])+$/,
      errorMessage: errors.badRequestError('The email must have the wolox domain')
    }
  }
};

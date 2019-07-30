exports.user_schema = {
  email: {
    in: ['body'],
    matches: {
      options: /^[a-zA-Z0-9]+@wolox.([A-Za-z])+$/,
      errorMessage: 'The email must have the wolox domain'
    }
  },
  password: {
    in: ['body'],
    matches: {
      options: /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
      errorMessage: 'The password must have letters and numbers and has to be at least 8 chars long'
    }
  },

  name: {
    in: ['body'],
    isLength: {
      errorMessage: 'The name cannot be empty',
      options: { min: 2 }
    }
  },

  last_name: {
    in: ['body'],
    isLength: {
      errorMessage: 'The last name cannot be empty',
      options: { min: 2 }
    }
  }
};

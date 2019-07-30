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
    isLength: {
      errorMessage: 'Password should be at least 8 chars long',
      options: { min: 8 }
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

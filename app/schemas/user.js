exports.user = {
  email: {
    matches: {
      options: /^[a-zA-Z0-9]+@wolox.([A-Za-z])+$/,
      errorMessage: 'The email must have the wolox domain'
    }
  },
  password: {
    isLength: {
      errorMessage: 'Password should be at least 8 chars long',
      options: { min: 8 }
    }
  },

  name: {
    isLength: {
      errorMessage: 'The name cannot be empty',
      options: { min: 2 }
    }
  },

  last_name: {
    isLength: {
      errorMessage: 'The last name cannot be empty',
      options: { min: 2 }
    }
  }
};

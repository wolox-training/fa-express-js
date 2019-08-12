const { factory } = require('factory-girl');
const { User } = require('../app/models');
exports.user = {
  name: 'Joe',
  last_name: 'Doe',
  email: 'joedoe@wolox.co',
  password: 'holamundo2019'
};

exports.signInData = {
  email: 'joedoe@wolox.co',
  password: 'holamundo2019'
};

factory.define('user', User, {
  name: 'Joe',
  last_name: 'Doe',
  email: 'joedoe@wolox.co',
  password: 'holamundo2019'
});

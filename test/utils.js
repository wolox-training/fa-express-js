const faker = require('faker');
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
  name: () => faker.name.firstName(),
  last_name: () => faker.name.lastName(),
  email: () => faker.internet.email(this.name, this.last_name, 'wolox.co'),
  password: () => faker.internet.password()
});

exports.createManyUsers = size => factory.createMany('user', size);
exports.createUser = () => factory.create('user');
exports.buildUser = () => factory.build('user');

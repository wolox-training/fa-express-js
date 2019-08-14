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

factory.define('randomUser', User, {
  name: () => faker.name.firstName(),
  last_name: () => faker.name.lastName(),
  email: () => faker.internet.email(this.name, this.last_name, 'wolox.co'),
  password: () => faker.internet.password()
});

exports.createManyUsers = size => factory.createMany('randomUser', size);
exports.createUser = factoryName => factory.create(factoryName ? factoryName : 'randomUser');
exports.buildUser = factoryName => factory.build(factoryName ? factoryName : 'randomUser');
exports.extendUser = (modelName, params) => factory.extend('randomUser', modelName, params);

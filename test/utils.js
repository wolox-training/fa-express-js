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

exports.createManyUsers = (size, factoryName = 'randomUser') => factory.createMany(factoryName, size);
exports.createUser = (factoryName = 'randomUser') => factory.create(factoryName);
exports.buildUser = (factoryName = 'randomUser') => factory.build(factoryName);
exports.extendUser = (modelName, params, factoryName = 'randomUser') =>
  factory.extend(factoryName, modelName, params);

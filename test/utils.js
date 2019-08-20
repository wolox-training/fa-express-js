const faker = require('faker');
const { factory } = require('factory-girl');
const { User } = require('../app/models');
const defaultFactoryName = 'randomUser';
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

factory.define(defaultFactoryName, User, {
  name: () => faker.name.firstName(),
  last_name: () => faker.name.lastName(),
  email: () => faker.internet.email(this.name, this.last_name, 'wolox.co'),
  password: () => faker.internet.password()
});

exports.createManyUsers = size => factory.createMany(defaultFactoryName, size);
exports.createUser = (factoryName = 'randomUser') => factory.create(factoryName);
exports.buildUser = factoryName => factory.build(factoryName ? factoryName : defaultFactoryName);
exports.extendUser = (modelName, params) => factory.extend(defaultFactoryName, modelName, params);

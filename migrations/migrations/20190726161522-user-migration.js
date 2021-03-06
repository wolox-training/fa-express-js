'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, unique: true, autoIncrement: true, allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false }
    }),
  down: queryInterface => queryInterface.dropTable('users')
};

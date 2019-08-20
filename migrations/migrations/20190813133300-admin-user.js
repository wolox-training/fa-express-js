'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'role', { type: Sequelize.STRING, defaultValue: 'client' }),

  down: queryInterface => queryInterface.removeColumn('users', 'admin')
};

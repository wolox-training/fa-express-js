'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('albums_purchases', {
      id: { type: Sequelize.INTEGER, unique: true, autoIncrement: true, allowNull: false, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      album_id: { type: Sequelize.INTEGER },
      album_name: { type: Sequelize.STRING, allowNull: false }
    }),
  down: queryInterface => queryInterface.dropTable('albums_purchases')
};

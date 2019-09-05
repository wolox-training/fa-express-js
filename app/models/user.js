'use strict';

const { VALIDATION_ROLES } = require('../constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, unique: true, autoIncrement: true, allowNull: false, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.STRING,
        validate: { isIn: { args: VALIDATION_ROLES, msg: 'Invalid role' } }
      }
    },
    { tableName: 'users', timestamps: false }
  );

  User.associate = models => {
    User.hasMany(models.AlbumsPurchases, { foreignKey: 'email' });
  };

  return User;
};

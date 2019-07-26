const Sequelize = require('sequelize');
const db = require('./index');

class User extends Sequelize.Model {}
User.init(
  {
    id: { type: Sequelize.INTEGER, unique: true, autoIncrement: true, allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    password: { type: Sequelize.STRING, allowNull: false }
  },
  { db, modelName: 'project' }
);

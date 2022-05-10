const { Sequelize, DataTypes } = require('sequelize');
const db = require('./index');

const User = db.sequelize.define('user', {
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  money: {
    type: Sequelize.DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 1000
  },
});

const ROLES = ['user', 'moderator'];

module.exports = { User, ROLES };
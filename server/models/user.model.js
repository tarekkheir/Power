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
  }
});

const ROLES = ['user', 'moderator'];

module.exports = { User, ROLES };
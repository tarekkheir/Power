const { Sequelize, DataTypes } = require('sequelize');
const db = require('./index');

const Shop = db.sequelize.define('shop', {
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  boss_id: {
    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  open_hours: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  fileName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  }
});


module.exports = { Shop };
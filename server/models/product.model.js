const { Sequelize, DataTypes } = require('sequelize');
const db = require('./index');

const Product = db.sequelize.define('product', {
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  type: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  boss_id: {
    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  quantity: {
    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0
  },
  shop_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  fileName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  star_rating: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true
  },
  reviews: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true
  }
});


module.exports = { Product };
const { Sequelize, DataTypes } = require('sequelize');
const db = require('./index');

const Cart = db.sequelize.define('cart', {
  user_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  expire_date: {
    type: Sequelize.DataTypes.BIGINT,
    allowNull: true
  },
  price: {
    type: Sequelize.DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shop_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false
  },
  fileName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  }
});

module.exports = { Cart };
const { Sequelize, DataTypes } = require('sequelize');
const db = require('./index');

const Fav = db.sequelize.define('fav', {
    user_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    shop_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = { Fav };
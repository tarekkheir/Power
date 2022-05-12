const { Sequelize, DataTypes } = require('sequelize');
const db = require('./index');

const ProductComment = db.sequelize.define('productComment', {
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
    },
    username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    comment: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    likes: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = { ProductComment };
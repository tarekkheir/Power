const { Sequelize, DataTypes } = require('sequelize');
const db = require('./index');

const Historic = db.sequelize.define('historic', {
    user_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    products: {
        type: Sequelize.DataTypes.JSON,
        allowNull: false
    },
    total: {
        type: Sequelize.DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = { Historic };
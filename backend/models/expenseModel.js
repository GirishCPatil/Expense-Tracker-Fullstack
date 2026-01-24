const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');


const Expense = sequelize.define('Expense', {
   id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    expAmt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expDes: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expCat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    note: {
  type: DataTypes.STRING,
  allowNull: true
}

}, {
    timestamps: false   
});

module.exports = Expense;
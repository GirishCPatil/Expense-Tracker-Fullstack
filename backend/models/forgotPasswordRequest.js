const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

  const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,   // auto-generate UUID
      primaryKey: true
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

    module.exports = ForgotPasswordRequest;

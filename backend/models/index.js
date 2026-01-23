const expenseModel = require('./expenseModel');
const userModel = require('./userModel');
const ForgotPasswordRequest = require("./forgotPasswordRequest");


userModel.hasMany(expenseModel, { foreignKey: 'userId', onDelete: 'CASCADE' });
expenseModel.belongsTo(userModel, { foreignKey: 'userId' });
userModel.hasMany(ForgotPasswordRequest, { foreignKey: "userId", onDelete: "CASCADE" });
ForgotPasswordRequest.belongsTo(userModel, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = {
 expenseModel,
  userModel,
  ForgotPasswordRequest
};
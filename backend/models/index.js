const expenseModel = require('./expenseModel');
const userModel = require('./userModel');


userModel.hasMany(expenseModel, { foreignKey: 'userId', onDelete: 'CASCADE' });
expenseModel.belongsTo(userModel, { foreignKey: 'userId' });


module.exports = {
 expenseModel,
  userModel,
};
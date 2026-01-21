const  User  = require('../models/userModel');
const Expense= require('../models/expenseModel');

const sequelize = require('../utils/db');
const premiumStatus = async (req, res) => {
    try {
        const isPremium = req.user.isPremium;
        res.status(200).json({ isPremium });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// const leaderboard = async (req, res) => {
//     try {
//         const expenses = await Expense.findAll({
//             attributes: ['userId', [sequelize.fn('SUM', sequelize.col('expAmt')), 'totalExpense']],
//             group: ['userId'],
//             order: [[sequelize.literal('totalExpense'), 'DESC']],
//             include: [{ model: User, attributes: ['name'] }]
//         });
  
//         res.status(200).json({ expenses }
//         );
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }      
// };

const leaderboard = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('SUM', sequelize.col('expenses.expAmt')), 'totalExpense']],
            include: [{ model: Expense, attributes: [] }],
            group: ['User.id'],
            order: [[sequelize.literal('totalExpense'), 'DESC']]
        }); 
        console.log(users);
        res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    premiumStatus,
    leaderboard
};
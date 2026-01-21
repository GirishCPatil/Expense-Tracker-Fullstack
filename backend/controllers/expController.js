const expenseModel = require('../models/expenseModel');

const addExpense = async (req, res) => {
    const { expAmt, expDes, expCat } = req.body;
    try {
        if (!expAmt || !expDes || !expCat) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Use the magic method createExpense provided by Sequelize association
        await req.user.createExpense({ 
            expAmt, 
            expDes, 
            expCat 
        });

        req.user.totalExpense += parseInt(expAmt);
        await req.user.save();
        
        res.status(201).json({ message: 'Expense added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error });
    }
};

const allExpenses = async (req, res) => {
    try {
        const expenses = await req.user.getExpenses();  
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteExpense = async (req, res) => { 
    const expenseId = req.params.id;
    try {
        // Only delete if the ID matches AND the userId belongs to the requester
        const result = await expenseModel.destroy({ 
            where: { id: expenseId, userId: req.user.id } 
        });
        
        if (result === 0) {
            return res.status(404).json({ success: false, message: "Expense does not belong to user" });
        }
        
        res.status(200).json({ message: 'Expense deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addExpense, allExpenses, deleteExpense };
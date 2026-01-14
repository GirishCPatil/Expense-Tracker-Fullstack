const expenseModel = require('../models/expenseModel');

const addExpense = async (req, res) => {
  try {
    const { expAmt, expDes, expCat } = req.body;
    if (!expAmt || !expDes || !expCat) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    await expenseModel.create({
        expAmt,
        expDes,
        expCat
    });
    
    res.status(201).json({ message: 'Expense added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } 
};



const allExpenses = async (req, res) => {
  try {
    const expenses = await expenseModel.findAll();  
    res.status(200).json(expenses);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteExpense = async (req, res) => { 
    try {
        const expenseId = req.params.id;
        await expenseModel.destroy({ where: { id: expenseId } });
        res.status(200).json({ message: 'Expense deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addExpense, allExpenses, deleteExpense };


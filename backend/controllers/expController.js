const expenseModel = require('../models/expenseModel');
const sequalize = require('../utils/db');



const addExpense = async (req, res) => {
    const { expAmt, expDes, expCat ,note} = req.body;
    const t = await sequalize.transaction();

    try {
        if (!expAmt || !expDes || !expCat || !note) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Use the magic method createExpense provided by Sequelize association
        await req.user.createExpense({ 
            expAmt, 
            expDes, 
            expCat,
            note
        }, { transaction: t });

        req.user.totalExpense += parseInt(expAmt);
        await req.user.save({ transaction: t });
        await t.commit();
        res.status(201).json({ message: 'Expense added successfully' });
    } catch (error) {
        await t.rollback();
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
    const expAmt= req.query.expAmt;
    const t = await sequalize.transaction();
    //const expAmt= req.body.expAmt;
    try {
        // Only delete if the ID matches AND the userId belongs to the requester
        const result = await expenseModel.destroy({ 
            where: { id: expenseId, userId: req.user.id ,
                  
            } 
        }, { transaction: t });

        req.user.totalExpense -= parseInt(expAmt);
        await req.user.save({ transaction: t });
        await t.commit();
        
        if (result === 0) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Expense does not belong to user" });
        }
        
        res.status(200).json({ message: 'Expense deleted successfully' });
        
    }
    catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addExpense, allExpenses, deleteExpense };
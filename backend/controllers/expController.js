const expenseModel = require('../models/expenseModel');
const sequalize = require('../utils/db');
const { uploadToS3 } = require('../services/s3Service');
const ExcelJS = require('exceljs');

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



const downloadExpenses = async (req, res) => {
  try {
    if (!req.user.isPremium) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const expenses = await expenseModel.findAll({
      where: { userId: req.user.id }
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Expenses');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Amount', key: 'expAmt', width: 15 },
      { header: 'Description', key: 'expDes', width: 25 },
      { header: 'Category', key: 'expCat', width: 15 },
      { header: 'Note', key: 'note', width: 25 }
    ];

    expenses.forEach(exp => {
      sheet.addRow({
        id: exp.id,
        expAmt: exp.expAmt,
        expDes: exp.expDes,
        expCat: exp.expCat,
        note: exp.note || ''
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const filename = `expenses/user-${req.user.id}/${Date.now()}.xlsx`;

    const fileUrl = await uploadToS3(
      buffer,
      filename,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.status(200).json({ fileUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Download failed' });
  }
};



module.exports = { addExpense, allExpenses, deleteExpense , downloadExpenses };
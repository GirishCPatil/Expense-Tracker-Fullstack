const express = require('express');
const { addExpense ,allExpenses,deleteExpense} = require('../controllers/expController');
const router = express.Router();


router.post('/addExpense', addExpense);
router.get('/getExpenses', allExpenses);
router.delete('/deleteExpense/:id', deleteExpense);

module.exports = router;

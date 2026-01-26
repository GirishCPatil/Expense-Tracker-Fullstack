const express = require('express');
const router = express.Router();
const expController = require('../controllers/expController');
const userAuthentication = require('../middlware/auth');

router.post('/addExpense', userAuthentication.authenticate, expController.addExpense);
router.get('/getExpenses', userAuthentication.authenticate, expController.allExpenses);
router.delete('/deleteExpense/:id', userAuthentication.authenticate, expController.deleteExpense);
router.get('/download', userAuthentication.authenticate, expController.downloadExpenses);

module.exports = router;
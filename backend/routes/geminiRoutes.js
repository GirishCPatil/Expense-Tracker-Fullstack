const express = require('express');
const router = express.Router();
const {getCategorySuggestions}= require('../controllers/geminiController');

router.get('/getCategory', getCategorySuggestions);


module.exports = router;
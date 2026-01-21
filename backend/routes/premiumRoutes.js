const express = require('express');
const router = express.Router();
const userAuthentication = require('../middlware/auth');
const { premiumStatus } = require('../controllers/premiumController');

router.get('/premium-status', userAuthentication, premiumStatus);



module.exports = router;
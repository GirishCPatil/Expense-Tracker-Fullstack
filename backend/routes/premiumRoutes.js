const express = require('express');
const router = express.Router();
const {authenticate} = require('../middlware/auth');
const { premiumStatus , leaderboard} = require('../controllers/premiumController');

router.get('/premium-status', authenticate, premiumStatus);
router.get('/leaderboard', leaderboard);

module.exports = router;
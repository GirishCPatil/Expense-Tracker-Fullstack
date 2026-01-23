const express = require('express');
const { createUser, loginUser, forgotPassword, resetPassword } = require('../controllers/userController');
const router = express.Router();
const path = require("path");

router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

// Serve reset password page (GET)
router.get('/password/resetpassword/:uuid', (req, res) => {
  console.log("Reset link opened for UUID:", req.params.uuid);

  res.sendFile(
    path.resolve(__dirname, '../../frontend/views/reset.html')
  );
});

// Handle new password submit (POST)
router.post('/password/resetpassword/:uuid', resetPassword);

module.exports = router;

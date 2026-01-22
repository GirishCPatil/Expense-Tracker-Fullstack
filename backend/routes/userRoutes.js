const express = require('express');
const { createUser, loginUser ,forgotPassword,resetPassword} = require('../controllers/userController');
const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser); 
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:userId", resetPassword);

router.get("/reset-password/:userId", (req, res) => {
  const path = require("path");
  res.sendFile(path.join(__dirname, "../../frontend/views/reset.html"));
});


module.exports = router;

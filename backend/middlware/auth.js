const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'secretkey');

        User.findByPk(user.userId).then(user => {
            // --- ADD THIS CHECK ---
            if (!user) {
                // If user doesn't exist in DB anymore, throw error
                throw new Error('User not found'); 
            }
            req.user = user;
            next();
        }).catch(err => {
             // This catches the 'User not found' error
            return res.status(401).json({success: false, message: "User not found"});
        });

    } catch(err) {
        console.log(err);
        return res.status(401).json({success: false, message: "Invalid Token"});
    }
}

module.exports = { authenticate };
const User = require('../models/userModel');

const createUser = (req, res) => {
    const { name, email, password } = req.body;
    // Here you would typically add code to save the user to the database
    User.create({ name, email, password });
    
    res.status(201).json({ message: 'User created successfully' });
}



module.exports = { createUser };
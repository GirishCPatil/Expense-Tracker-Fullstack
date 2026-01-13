const User = require('../models/userModel');


const createUser = async (req, res) => {
try {
const { name, email, password } = req.body;


// Validation
if (!name || !email || !password) {
return res.status(400).json({ message: 'All fields are required' });
}


// Check if user already exists
const existingUser = await User.findOne({ where: { email } });


if (existingUser) {
return res.status(409).json({ message: 'User already exists' });
}


// Create new user
await User.create({ name, email, password });


res.status(201).json({ message: 'User created successfully' });


} catch (error) {
console.error(error);
res.status(500).json({ message: 'Server error' });
}
};


module.exports = { createUser };
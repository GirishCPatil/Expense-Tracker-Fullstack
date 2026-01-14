const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // 🔐 Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



const loginUser = async (req, res) => {
const { email, password } = req.body;


const user = await User.findOne({ where: { email } });
if (!user) return res.status(404).json({ message: 'User not found' });


const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(401).json({ message: 'User not authorized' });


const token = jwt.sign(
{ userId: user.id, email: user.email },
'secretkey',
{ expiresIn: '1h' }
);


res.status(200).json({ message: 'Login successful', token });
};

module.exports = { createUser, loginUser };
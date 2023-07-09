const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'mySecretKey123';

router.post('/signup', async (req, res) => {
  try {
    let { email, firstName, lastName, password, birthdate } = req.body;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of hashing rounds
    const existingUser = await User.findUserByEmail(email);
    if (existingUser !== null && !Array.isArray(existingUser) && !existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    await User.createUser({ email, firstName, lastName, hashedPassword, birthdate });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByEmail(email);
    if (user) {
      const isPasswordMatch = await User.comparePassword(password, user.hashedPassword);
      if (isPasswordMatch) {
        const token = jwt.sign({ email: user.email, userId: user._id }, secretKey, { expiresIn: '1d' });
        res.status(200).json({ message: 'Login successful', user: { token, id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, birthdate: user.birthdate } });
      } else {
        res.status(401).json({ message: 'Incorrect password' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/users', async (req, res) => {
  try {
    let users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error });
  }
})
module.exports = router;

router.put('/changePassword', async (req, res) => {
  try {
    const { email, formerPassword, newPassword } = req.body;
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordMatch = await User.comparePassword(formerPassword, user.hashedPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.changePassword(email, hashedPassword);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
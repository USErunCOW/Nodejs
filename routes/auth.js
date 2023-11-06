const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Login successful', user: req.user });
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;

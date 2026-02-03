const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { protect } = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Force role to user to prevent unauthorized admin creation
        const user = await User.create({ username, email, password, role: 'user' });
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ success: true, token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Get current user details
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Update profile/password
router.put('/update-profile', protect, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findById(req.user.id);

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();
        res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;

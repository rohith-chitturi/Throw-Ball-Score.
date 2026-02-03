const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Create new user/admin (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const user = await User.create({ username, email, password, role });
        res.status(201).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Update user role (Admin only)
router.patch('/:id/role', protect, authorize('admin'), async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Delete user (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        // Prevent deleting yourself
        if (req.user.id === req.params.id) {
            return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;

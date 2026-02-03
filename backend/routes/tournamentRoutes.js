const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const { protect, authorize } = require('../middleware/auth');

// Get all tournaments
router.get('/', async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.status(200).json({ success: true, data: tournaments });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Admin: Update Tournament
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: tournament });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Admin: Delete Tournament
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await Tournament.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;

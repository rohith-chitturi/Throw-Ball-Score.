const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Player = require('../models/Player');
const { protect, authorize } = require('../middleware/auth');

// Get all teams
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find().populate('players');
        res.status(200).json({ success: true, data: teams });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Admin: Create Team
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const team = await Team.create(req.body);
        res.status(201).json({ success: true, data: team });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Admin: Update Team
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: team });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Admin: Delete Team
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);
        // Also delete associated players
        await Player.deleteMany({ team: req.params.id });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Admin: Add Player to Team
router.post('/:id/players', protect, authorize('admin'), async (req, res) => {
    try {
        const player = await Player.create({ ...req.body, team: req.params.id });
        await Team.findByIdAndUpdate(req.params.id, { $push: { players: player._id } });
        res.status(201).json({ success: true, data: player });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Admin: Remove Player from Team
router.delete('/players/:playerId', protect, authorize('admin'), async (req, res) => {
    try {
        const player = await Player.findById(req.params.playerId);
        if (!player) return res.status(404).json({ success: false, message: 'Player not found' });

        await Team.findByIdAndUpdate(player.team, { $pull: { players: player._id } });
        await Player.findByIdAndDelete(req.params.playerId);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;

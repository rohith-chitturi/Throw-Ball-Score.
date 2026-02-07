const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Team = require('../models/Team');
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/auth');

// Get all matches (Optionally filter by scorer)
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.scorer) {
            query.scorer = req.query.scorer;
        }

        const matches = await Match.find(query)
            .sort({ createdAt: -1 }) // Show newest matches first
            .populate({ path: 'teamA', populate: { path: 'players' } })
            .populate({ path: 'teamB', populate: { path: 'players' } })
            .populate('tournament matchWinner scorer');
        res.status(200).json({ success: true, data: matches });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Get single match
router.get('/:id', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate({ path: 'teamA', populate: { path: 'players' } })
            .populate({ path: 'teamB', populate: { path: 'players' } })
            .populate('tournament matchWinner');
        res.status(200).json({ success: true, data: match });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Admin/Scorer: Create Match
router.post('/', protect, authorize('admin', 'scorer'), async (req, res) => {
    try {
        const { teamAName, teamBName, tournament, venue, date, scorer, pointsPerSet } = req.body;

        // Find or create Team A
        let teamA = await Team.findOne({ name: new RegExp('^' + teamAName + '$', 'i') });
        if (!teamA) {
            teamA = await Team.create({ name: teamAName, shortName: teamAName.substring(0, 3).toUpperCase() });
        }

        // Find or create Team B
        let teamB = await Team.findOne({ name: new RegExp('^' + teamBName + '$', 'i') });
        if (!teamB) {
            teamB = await Team.create({ name: teamBName, shortName: teamBName.substring(0, 3).toUpperCase() });
        }

        // Check for duplicate active match between these teams
        const existingMatch = await Match.findOne({
            tournament,
            status: { $in: ['upcoming', 'live'] },
            $or: [
                { teamA: teamA._id, teamB: teamB._id },
                { teamA: teamB._id, teamB: teamA._id }
            ]
        });

        if (existingMatch) {
            return res.status(400).json({
                success: false,
                error: `A match between these teams already exists in this tournament (${existingMatch.status})`
            });
        }

        const match = await Match.create({
            teamA: teamA._id,
            teamB: teamB._id,
            tournament,
            venue,
            date,
            pointsPerSet: pointsPerSet || 27,
            scorer: scorer || null, // Leave null for Admin assignment as per user request
            sets: [
                { setNumber: 1, teamAScore: 0, teamBScore: 0 },
                { setNumber: 2, teamAScore: 0, teamBScore: 0 },
                { setNumber: 3, teamAScore: 0, teamBScore: 0 }
            ]
        });

        const populatedMatch = await Match.findById(match._id).populate('teamA teamB tournament');
        res.status(201).json({ success: true, data: populatedMatch });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Scorer Only: Update Score
router.post('/:id/score', protect, authorize('scorer'), async (req, res) => {
    try {
        const { team, points } = req.body; // team: 'teamA' or 'teamB', points: 1 or -1
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ success: false, message: 'Match not found' });

        // Authorization Check: ONLY Assigned Scorer (Admin can view but not score)
        if (match.scorer?.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Only the assigned scorer can update the score' });
        }

        if (match.status !== 'live') return res.status(400).json({ success: false, message: 'Match is not live' });

        const winPoints = match.pointsPerSet || 27;
        const currentSetIndex = match.currentSet - 1;
        const currentSet = match.sets[currentSetIndex];

        // 1. Safety Check: If set is already completed, allow no more points
        if (currentSet.isCompleted) {
            return res.status(400).json({ success: false, message: 'Current set is already completed' });
        }

        // 2. Update score
        if (team === 'teamA') {
            currentSet.teamAScore += points;
            if (currentSet.teamAScore < 0) currentSet.teamAScore = 0;
        } else {
            currentSet.teamBScore += points;
            if (currentSet.teamBScore < 0) currentSet.teamBScore = 0;
        }

        // 3. Check for Set Victory
        if (currentSet.teamAScore >= winPoints || currentSet.teamBScore >= winPoints) {
            currentSet.isCompleted = true;
            currentSet.winner = currentSet.teamAScore >= winPoints ? match.teamA : match.teamB;

            // 4. Check for Match Victory (Best of 3)
            const teamAWins = match.sets.filter(s => s.winner && s.winner.toString() === match.teamA.toString()).length;
            const teamBWins = match.sets.filter(s => s.winner && s.winner.toString() === match.teamB.toString()).length;

            if (teamAWins >= 2) {
                match.matchWinner = match.teamA;
                match.status = 'completed';
            } else if (teamBWins >= 2) {
                match.matchWinner = match.teamB;
                match.status = 'completed';
            } else if (match.currentSet < 3) {
                // Move to next set only if match not yet won
                match.currentSet += 1;
            } else {
                // Fallback for 3rd set completion
                match.status = 'completed';
            }
        }

        await match.save();

        const fullyPopulatedMatch = await Match.findById(match._id)
            .populate({ path: 'teamA', populate: { path: 'players' } })
            .populate({ path: 'teamB', populate: { path: 'players' } })
            .populate('tournament matchWinner');

        // Log the action
        await AuditLog.create({
            action: 'SCORE_UPDATE',
            performedBy: req.user._id,
            details: {
                matchId: match._id,
                team,
                points,
                newScore: team === 'teamA' ? currentSet.teamAScore : currentSet.teamBScore,
                set: match.currentSet
            }
        });

        // Emit real-time update
        const io = req.app.get('io');
        io.to(match._id.toString()).emit('scoreUpdate', fullyPopulatedMatch);
        io.to('matches').emit('scoreUpdate', fullyPopulatedMatch); // Global room for Home page

        res.status(200).json({ success: true, data: fullyPopulatedMatch });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Scorer Only: Update Status (Start Match)
router.patch('/:id/status', protect, authorize('scorer'), async (req, res) => {
    try {
        const { status } = req.body;
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ success: false, message: 'Match not found' });

        // Authorization Check: ONLY Assigned Scorer
        if (match.scorer?.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Only the assigned scorer can update match status' });
        }

        // Ensure scorer is assigned before going live
        if (status === 'live' && !match.scorer) {
            return res.status(400).json({ success: false, message: 'Cannot start match without an assigned scorer' });
        }

        match.status = status;
        await match.save();

        const populatedMatch = await Match.findById(match._id)
            .populate({ path: 'teamA', populate: { path: 'players' } })
            .populate({ path: 'teamB', populate: { path: 'players' } })
            .populate('tournament matchWinner');

        const io = req.app.get('io');
        io.to(match._id.toString()).emit('statusUpdate', populatedMatch);
        io.to('matches').emit('statusUpdate', populatedMatch); // Global room for Home page

        res.status(200).json({ success: true, data: populatedMatch });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Admin: Update Match Info
router.put('/:id', protect, authorize('admin', 'scorer'), async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ success: false, message: 'Match not found' });

        // Authorization Check: Admin or Assigned Scorer
        if (req.user.role !== 'admin' && match.scorer?.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to edit this match' });
        }

        const updatedMatch = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('teamA teamB tournament matchWinner');
        res.status(200).json({ success: true, data: updatedMatch });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Admin/Scorer: Delete Match
router.delete('/:id', protect, authorize('admin', 'scorer'), async (req, res) => {
    try {
        await Match.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;

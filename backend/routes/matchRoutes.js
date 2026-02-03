const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Team = require('../models/Team');
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/auth');

// Get all matches
router.get('/', async (req, res) => {
    try {
        const matches = await Match.find()
            .populate({ path: 'teamA', populate: { path: 'players' } })
            .populate({ path: 'teamB', populate: { path: 'players' } })
            .populate('tournament matchWinner');
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

// Admin: Create Match
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { teamAName, teamBName, tournament, venue, date } = req.body;

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

        const match = await Match.create({
            teamA: teamA._id,
            teamB: teamB._id,
            tournament,
            venue,
            date,
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

// Admin: Update Score
router.post('/:id/score', protect, authorize('admin'), async (req, res) => {
    try {
        const { team, points } = req.body; // team: 'teamA' or 'teamB', points: 1 or -1
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ success: false, message: 'Match not found' });
        if (match.status !== 'live') return res.status(400).json({ success: false, message: 'Match is not live' });

        const currentSetIndex = match.currentSet - 1;
        const currentSet = match.sets[currentSetIndex];

        if (team === 'teamA') {
            currentSet.teamAScore += points;
            if (currentSet.teamAScore < 0) currentSet.teamAScore = 0;
        } else {
            currentSet.teamBScore += points;
            if (currentSet.teamBScore < 0) currentSet.teamBScore = 0;
        }

        // Check if set is won (First to 27)
        if (currentSet.teamAScore >= 27 || currentSet.teamBScore >= 27) {
            currentSet.isCompleted = true;
            currentSet.winner = currentSet.teamAScore >= 27 ? match.teamA : match.teamB;

            // Check if match is won (Best of 3)
            const teamAWins = match.sets.filter(s => s.winner && s.winner.equals(match.teamA)).length;
            const teamBWins = match.sets.filter(s => s.winner && s.winner.equals(match.teamB)).length;

            if (teamAWins >= 2) {
                match.matchWinner = match.teamA;
                match.status = 'completed';
            } else if (teamBWins >= 2) {
                match.matchWinner = match.teamB;
                match.status = 'completed';
            } else if (match.currentSet < 3) {
                match.currentSet += 1;
            } else {
                // If it was the 3rd set and somehow no one has 2 wins? 
                // In best of 3, someone MUST have 2 wins by end of set 3.
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

// Admin: Update Status (Start Match)
router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const match = await Match.findByIdAndUpdate(req.params.id, { status }, { new: true })
            .populate({ path: 'teamA', populate: { path: 'players' } })
            .populate({ path: 'teamB', populate: { path: 'players' } })
            .populate('tournament matchWinner');

        const io = req.app.get('io');
        io.to(match._id.toString()).emit('statusUpdate', match);
        io.to('matches').emit('statusUpdate', match); // Global room for Home page

        res.status(200).json({ success: true, data: match });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Admin: Update Match Info
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('teamA teamB tournament matchWinner');
        res.status(200).json({ success: true, data: match });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Admin: Delete Match
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await Match.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;

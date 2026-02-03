const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
    setNumber: { type: Number, required: true },
    teamAScore: { type: Number, default: 0 },
    teamBScore: { type: Number, default: 0 },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    isCompleted: { type: Boolean, default: false }
});

const matchSchema = new mongoose.Schema({
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
    teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    date: { type: Date, default: Date.now },
    venue: { type: String },
    status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
    tossWinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    tossDecision: { type: String, enum: ['serve', 'receive'] },
    currentSet: { type: Number, default: 1 },
    sets: [setSchema],
    matchWinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    scorer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);

const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    jerseyNumber: { type: Number, required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    isCaptain: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);

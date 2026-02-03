const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    venue: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    organizer: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);

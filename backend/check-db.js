const mongoose = require('mongoose');
const Tournament = require('./models/Tournament');
require('dotenv').config();

async function checkTournaments() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        const tournaments = await Tournament.find();
        console.log('Tournaments in DB:', JSON.stringify(tournaments, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkTournaments();

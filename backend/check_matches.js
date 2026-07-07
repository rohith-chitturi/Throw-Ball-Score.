const mongoose = require('mongoose');

const uri = "mongodb+srv://chitturirohith333_db_user:42xuMzsIV5gsjc3x@throwball.fmz9xq4.mongodb.net/?appName=Throwball";

async function run() {
    try {
        await mongoose.connect(uri);
        const Match = mongoose.model('Match', new mongoose.Schema({
            teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
            teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
        }, { strict: false }));
        
        const Team = mongoose.model('Team', new mongoose.Schema({
            name: String,
            players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
        }, { strict: false }));

        const Player = mongoose.model('Player', new mongoose.Schema({
            name: String
        }, { strict: false }));
        
        const matches = await Match.find().populate({
            path: 'teamA teamB',
            populate: { path: 'players' }
        });
        
        matches.forEach((m, idx) => {
            const aNames = m.teamA?.players?.map(p => p.name).join(', ') || '';
            const bNames = m.teamB?.players?.map(p => p.name).join(', ') || '';
            if (aNames && bNames && aNames === bNames) {
                console.log(`Match ${m._id} has identical players!`);
                console.log(`Team A: ${aNames}`);
                console.log(`Team B: ${bNames}`);
            }
        });
        console.log("Done checking identical players.");
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

run();

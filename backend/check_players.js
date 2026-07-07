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
        
        const match = await Match.findOne()
            .populate({ path: 'teamA', populate: { path: 'players' } })
            .populate({ path: 'teamB', populate: { path: 'players' } })
            .lean();
            
        console.log("Team A Players:", match.teamA.players.map(p => p.name));
        console.log("Team B Players:", match.teamB.players.map(p => p.name));
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

run();

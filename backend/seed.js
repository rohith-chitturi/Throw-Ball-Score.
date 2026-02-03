require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Team = require('./models/Team');
const Player = require('./models/Player');
const Tournament = require('./models/Tournament');
const Match = require('./models/Match');

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        mongoose.set('debug', true);
        console.log('Connected!');

        console.log('Clearing old data...');
        await User.deleteMany({}); console.log('Users cleared');
        await Team.deleteMany({}); console.log('Teams cleared');
        await Player.deleteMany({}); console.log('Players cleared');
        await Tournament.deleteMany({}); console.log('Tournaments cleared');
        await Match.deleteMany({}); console.log('Matches cleared');

        // Create Admin (Idempotent - only creates if no users exist)
        console.log('Checking for existing users...');
        const userCount = await User.countDocuments();

        if (userCount === 0) {
            console.log('No users found. Creating initial admin...');

            const adminUsername = process.env.ADMIN_USERNAME;
            const adminPassword = process.env.ADMIN_PASSWORD;
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@throwball.com';

            if (!adminUsername || !adminPassword) {
                throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env for initial setup');
            }

            const admin = new User({
                username: adminUsername,
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            await admin.save();
            console.log(`Initial admin created: ${adminUsername}`);
        } else {
            console.log('Users already exist. Skipping admin creation.');
        }

        // Create Tournaments
        console.log('Creating tournaments...');
        const tourney1 = await Tournament.create({
            name: 'CBIT Throwball Premier League 2026',
            startDate: new Date('2026-02-01'),
            endDate: new Date('2026-02-15'),
            venue: 'CBIT Arena'
        });

        const tourney2 = await Tournament.create({
            name: 'Hyderabad Inter-College Championship',
            startDate: new Date('2026-03-10'),
            endDate: new Date('2026-03-12'),
            venue: 'Gachibowli Indoor Stadium'
        });

        // Create Teams
        console.log('Creating teams...');
        const teamsRaw = [
            { name: 'Royal Strikers', shortName: 'RST' },
            { name: 'Titans XI', shortName: 'TTN' },
            { name: 'Cyber Warriors', shortName: 'CWR' },
            { name: 'Phoenix Blaze', shortName: 'PHX' },
            { name: 'Emerald Eagles', shortName: 'EME' },
            { name: 'Vanguard Victors', shortName: 'VGV' }
        ];

        const createdTeams = await Team.insertMany(teamsRaw);

        // Create Matches
        console.log('Creating matches...');
        const matchData = [
            {
                tournament: tourney1._id,
                teamA: createdTeams[0]._id,
                teamB: createdTeams[1]._id,
                venue: 'CBIT Arena - Court 1',
                status: 'live',
                currentSet: 1,
                date: new Date(),
                sets: [
                    { setNumber: 1, teamAScore: 14, teamBScore: 12, isCompleted: false },
                    { setNumber: 2, teamAScore: 0, teamBScore: 0, isCompleted: false },
                    { setNumber: 3, teamAScore: 0, teamBScore: 0, isCompleted: false }
                ]
            },
            {
                tournament: tourney1._id,
                teamA: createdTeams[2]._id,
                teamB: createdTeams[3]._id,
                venue: 'CBIT Arena - Court 2',
                status: 'upcoming',
                date: new Date(Date.now() + 86400000), // Tomorrow
                sets: [
                    { setNumber: 1, teamAScore: 0, teamBScore: 0 },
                    { setNumber: 2, teamAScore: 0, teamBScore: 0 },
                    { setNumber: 3, teamAScore: 0, teamBScore: 0 }
                ]
            },
            {
                tournament: tourney1._id,
                teamA: createdTeams[4]._id,
                teamB: createdTeams[5]._id,
                venue: 'CBIT Main Ground',
                status: 'completed',
                date: new Date(Date.now() - 86400000), // Yesterday
                matchWinner: createdTeams[4]._id,
                sets: [
                    { setNumber: 1, teamAScore: 27, teamBScore: 25, isCompleted: true, winner: createdTeams[4]._id },
                    { setNumber: 2, teamAScore: 22, teamBScore: 27, isCompleted: true, winner: createdTeams[5]._id },
                    { setNumber: 3, teamAScore: 27, teamBScore: 20, isCompleted: true, winner: createdTeams[4]._id }
                ]
            }
        ];

        await Match.insertMany(matchData);

        console.log('Database Seeded Successfully!');
        process.exit(0);
    } catch (err) {
        console.error('SEEDING FAILED!');
        console.error(err);
        process.exit(1);
    }
};

seedDB();

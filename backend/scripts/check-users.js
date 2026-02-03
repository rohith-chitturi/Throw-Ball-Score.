require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}, 'username email role');

        console.log('\n--- Current Users in Database ---');
        if (users.length === 0) {
            console.log('No users found.');
        } else {
            console.table(users.map(u => ({
                Username: u.username,
                Email: u.email,
                Role: u.role
            })));
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkUsers();

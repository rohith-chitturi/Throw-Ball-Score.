require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const resetAdmin = async () => {
    try {
        console.log('--- Emergency Admin Password Reset ---');

        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;

        if (!username || !password || password === 'change-me-immediately-123') {
            console.error('ERROR: Please set a temporary ADMIN_USERNAME and a NEW ADMIN_PASSWORD in your backend/.env file first.');
            console.log('Example in .env:');
            console.log('ADMIN_USERNAME=admin');
            console.log('ADMIN_PASSWORD=my_new_secure_password_123');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);

        // Find the user by username or find any existing admin
        let admin = await User.findOne({ username }) || await User.findOne({ role: 'admin' });

        if (!admin) {
            console.log('No admin found. Creating a new one...');
            admin = new User({
                username,
                email: 'admin@throwball.com',
                password,
                role: 'admin'
            });
        } else {
            console.log(`Found user: ${admin.username} (Current Role: ${admin.role})`);
            admin.username = username;
            admin.password = password;
            admin.role = 'admin'; // FORCE Role to admin
        }

        await admin.save();
        console.log('\nSUCCESS!');
        console.log('-----------------------------------');
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');
        console.log('You can now log in using these credentials.');

        process.exit(0);
    } catch (err) {
        console.error('FAILED to reset admin:', err.message);
        process.exit(1);
    }
};

resetAdmin();

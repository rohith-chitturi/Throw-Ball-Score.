require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
    try {
        console.log('--- Production Admin Creation ---');

        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;
        const email = process.env.ADMIN_EMAIL || 'admin@throwball.com';

        if (!username || !password) {
            console.error('ERROR: ADMIN_USERNAME and ADMIN_PASSWORD must be defined in your production environment variables.');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to Database...');

        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log(`NOTICE: An admin user already exists (${existingAdmin.username}).`);
            console.log('To change the password, use the web interface Profile Settings.');
            process.exit(0);
        }

        const newAdmin = new User({
            username,
            email,
            password,
            role: 'admin'
        });

        await newAdmin.save();
        console.log('SUCCESS: Production Admin account created successfully.');
        console.log(`Username: ${username}`);
        console.log('Password: [HIDDEN]');

        process.exit(0);
    } catch (err) {
        console.error('FAILED to create admin:', err.message);
        process.exit(1);
    }
};

createAdmin();

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected');
        await User.deleteMany({});
        const admin = await User.create({
            username: 'admin',
            email: 'admin@throwball.com',
            password: 'password123',
            role: 'admin'
        });
        console.log('Admin created');
        process.exit(0);
    } catch (err) {
        console.error('FULL ERROR:', err);
        process.exit(1);
    }
};

test();

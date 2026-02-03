require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.set('io', io);

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
app.use(helmet({
    contentSecurityPolicy: false // Required for cross-domain socket connections
}));

// Rate Limiting (Relaxed for dev/testing)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit to 1000 requests
});
app.use('/api/', limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO
const socketMain = require('./sockets/socketMain');
socketMain(io);

// Auto-create Admin if none exists (Production Safety)
const User = require('./models/User');
const autoCreateAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const username = process.env.ADMIN_USERNAME;
            const password = process.env.ADMIN_PASSWORD;
            const email = process.env.ADMIN_EMAIL || 'admin@cbit.com';

            if (username && password) {
                await User.create({
                    username,
                    password,
                    email,
                    role: 'admin'
                });
                console.log('--- PRODUCTION INFO: Initial admin account auto-created ---');
            } else {
                console.warn('--- PRODUCTION INFO: Not creating admin because credentials are missing in env ---');
            }
        }
    } catch (err) {
        console.error('Auto-admin creation failed:', err.message);
    }
};
autoCreateAdmin();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/tournaments', require('./routes/tournamentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

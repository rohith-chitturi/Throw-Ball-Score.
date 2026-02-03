require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const socketIo = require('socket.io');

const app = express();
app.set('trust proxy', 1); // Required for Render and rate limiting
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 600000,
    pingInterval: 25000
});

app.set('io', io);

// Middleware
app.use(express.json());

// Enhanced CORS for production
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://cbit-throwball-2026.onrender.com',
    'https://throwball-frontend.onrender.com', // Added this to fix the current error
    'http://localhost:5173'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes(origin + '/')) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
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

// Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'active', message: 'Throwball Backend API is running' });
});

// Socket.IO
const socketMain = require('./sockets/socketMain');
socketMain(io);

// Connect to MongoDB
const User = require('./models/User');
const autoCreateAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const username = process.env.ADMIN_USERNAME;
            const password = process.env.ADMIN_PASSWORD;
            const email = process.env.ADMIN_EMAIL || 'admin@cbit.com';

            if (username && password) {
                await User.create({ username, password, email, role: 'admin' });
                console.log('--- PRODUCTION INFO: Initial admin account auto-created ---');
            }
        }
    } catch (err) {
        console.error('Auto-admin creation failed:', err.message);
    }
};

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
        autoCreateAdmin();
    })
    .catch(err => console.error('MongoDB connection error:', err));

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

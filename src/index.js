require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { createClient } = require('redis');
const connectRedis = require('connect-redis');
const RedisStore = connectRedis.default;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    legacyMode: false
});

// Initialize store
const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'calendar:'
});

// Create session middleware
const sessionMiddleware = session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
});

// Error handling for Redis
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
});

redisClient.on('ready', () => {
    console.log('Redis client ready');
});

// Connect to Redis and start server
async function startServer() {
    try {
        // Connect to Redis
        await redisClient.connect();
        console.log('Redis connection established');

        // Middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cors());
        app.use(express.static(path.join(__dirname, 'public')));

        // Apply session middleware
        app.use(sessionMiddleware);

        // Routes
        app.use('/auth', require('./routes/auth'));
        app.use('/api', require('./routes/api'));

        // Serve index.html
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('Server Error:', err.stack);
            res.status(500).json({ error: 'Something went wrong!' });
        });

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();

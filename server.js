// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studyRoutes = require('./routes/studyRoutes');

const app = express();


// ================================
// CORS CONFIGURATION
// ================================

const allowedOrigins = [
    'https://studygeniussai.netlify.app',
    'https://6a19e985aaee7a0008867117--studygeniussai.netlify.app',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
];

app.use(cors({
    origin: function (origin, callback) {

        // Allow requests with no origin (Postman/mobile apps)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy blocked this origin'));
        }
    },

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Handle preflight requests
app.options('*', cors());


// ================================
// BODY PARSER
// ================================

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));


// ================================
// DATABASE CONNECTION
// ================================

mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
    .then(() => {
        console.log('🚀 Database connection running smoothly.');
    })
    .catch((err) => {
        console.error('❌ Database connection crash:', err);
    });


// ================================
// ROUTES
// ================================

app.use('/api/study', studyRoutes);


// ================================
// HEALTH CHECK
// ================================

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        message: 'StudyGenius backend cluster active.'
    });
});


// ================================
// SERVER
// ================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});


// ================================
// ERROR HANDLING
// ================================

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT ERROR => ', err);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION => ', err);
});

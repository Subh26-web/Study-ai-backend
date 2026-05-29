

// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studyRoutes = require('./routes/studyRoutes');

const app = express();

// 1. CORS UPDATE: Matched to the Live Server port (5500) visible in your screenshot
app.use(cors({
    origin: ['https://studygeniussai.netlify.app'],
    credentials: true
}));

// Payload size expansion to handle massive raw textual layers safely
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
    .then(() => console.log('🚀 Database connection running smoothly.'))
    .catch(err => console.error('Database connection crash:', err));

// 2. ROUTE DEFINITION 
app.use('/api/study', studyRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: "healthy", message: "StudyGenius backend cluster active." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));


process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT ERROR => ', err);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION => ', err);
});

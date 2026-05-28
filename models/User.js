
// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  metrics: {
    totalSessions: { type: Number, default: 0 },
    totalFlashcards: { type: Number, default: 0 },
    totalQuizQuestions: { type: Number, default: 0 },
    totalSummaries: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
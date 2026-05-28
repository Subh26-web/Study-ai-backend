const mongoose = require('mongoose');

const FlashcardItemSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

const QuizQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String }],
    answer: { type: String, required: true },
    explanation: { type: String, default: "" }
});

const StudySessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },        // E.g., "Photosynthesis Notes"
    category: { type: String, default: "General" }, // E.g., "Biology", "Physics"
    rawInputNotes: { type: String, required: true }, // Stores the original text input
    
    // The generated structures matching your parser hooks exactly
    flashcards: [FlashcardItemSchema],
    quiz: {
        questions: [QuizQuestionSchema]
    },
    summary: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('StudySession', StudySessionSchema);
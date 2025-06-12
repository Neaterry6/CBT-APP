// server/models/QuizResult.js
const mongoose = require('mongoose');
const quizResultSchema = new mongoose.Schema({
    nickname: { type: String, required: true },
    subject: { type: String },
    question: { type: Object },
    userAnswer: { type: String },
    correct: { type: Boolean },
    timeSpent: { type: Number },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('QuizResult', quizResultSchema);

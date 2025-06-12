const express = require('express');
const router = express.Router();
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');

router.post('/user', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save user' });
    }
});

router.post('/quiz', async (req, res) => {
    try {
        const quizResult = new QuizResult(req.body);
        await quizResult.save();
        res.status(201).json(quizResult);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save quiz result' });
    }
});

module.exports = router;

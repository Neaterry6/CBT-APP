// server/routes/api.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const StudiedTopic = require('../models/StudiedTopic');

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

router.post('/studied', async (req, res) => {
    try {
        const studiedTopic = new StudiedTopic(req.body);
        await studiedTopic.save();
        res.status(201).json(studiedTopic);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save studied topic' });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const results = await QuizResult.aggregate([
            {
                $group: {
                    _id: '$nickname',
                    score: { $avg: { $cond: [{ $eq: ['$correct', true] }, 100, 0] } }
                }
            },
            {
                $sort: { score: -1 }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    nickname: '$_id',
                    score: { $round: ['$score', 2] }
                }
            }
        ]);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

module.exports = router;
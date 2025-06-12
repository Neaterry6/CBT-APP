// server/models/StudiedTopic.js
const mongoose = require('mongoose');
const studiedTopicSchema = new mongoose.Schema({
    nickname: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('StudiedTopic', studiedTopicSchema);

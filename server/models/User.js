// server/models/User.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    nickname: { type: String, required: true },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema); 
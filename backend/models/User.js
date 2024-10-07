// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    email: { type: String, required: false, unique: true },
    notification: { type: Boolean, required: true }
});

module.exports = mongoose.model('User', userSchema);

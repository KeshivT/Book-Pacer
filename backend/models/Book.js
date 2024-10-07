// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
    filePath: { type: String, required: true }, // Path to the file
    format: { type: String, required: true },
    lastUnlockedChapter: { type: Number, default: 0 },
    unlockedDate: { type: Date },
    //unlockWaitTime: { type: Number, default: 24 * 60 * 60 * 1000},
    lastReadChapter: { type: Number, default: 0 },
    minTime: { type: Number, default: 1},
    maxTime: {type: Number, default: 4}
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
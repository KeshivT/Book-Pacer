const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    index: { type: Number, required: true },
    locked: { type: Boolean, default: true },
    read: { type: Boolean, default: false },
    unlockTime: { type: Date, default: Date.now()},
    notified: { type: Boolean, default: false }
});

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
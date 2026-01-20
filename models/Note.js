const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
    {
        text: String,
        userId: mongoose.Schema.Types.ObjectId
    },
    { timestamps: true }
);

module.exports = mongoose.model('Note', NoteSchema);

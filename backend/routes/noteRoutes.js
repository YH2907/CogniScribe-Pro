const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Create note (Speech - Text saved)
router.post('/', auth, async (req, res) => {
    try {
        const note = await Note.create({
            userId: req.user.id,
            text: req.body.text,
        });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read all notes
router.get('/', auth, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update note
router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { text: req.body.text },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
    try {
        await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

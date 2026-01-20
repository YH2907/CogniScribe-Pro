require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const User = require('./models/User');
const Note = require('./models/Note');
const auth = require('./middleware/auth');

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

// ================= AUTH =================

// Register
app.post('/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();

        res.json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Login
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Login failed' });
    }
});

// ================= NOTES =================

// Get notes
app.get('/notes', auth, async (req, res) => {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
});

// Create note
app.post('/notes', auth, async (req, res) => {
    const { text } = req.body;
    const note = new Note({ text, userId: req.user.id });
    await note.save();
    res.json(note);
});

// Update note
app.put('/notes/:id', auth, async (req, res) => {
    const note = await Note.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { text: req.body.text },
        { new: true }
    );
    res.json(note);
});

// Delete note
app.delete('/notes/:id', auth, async (req, res) => {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Note deleted' });
});

// ================= GROQ AI SUMMARY =================

app.post('/notes/summarize', auth, async (req, res) => {
    try {
        const { text } = req.body;
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'GROQ_API_KEY missing' });
        }

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'user',
                        content: `Summarize the following notes clearly and concisely:\n\n${text}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const summary = response.data.choices?.[0]?.message?.content;

        res.json({ summary });
    } catch (err) {
        console.error('❌ Groq API Error:', err.response?.data || err.message);
        res.status(500).json({ message: 'AI summarization failed' });
    }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

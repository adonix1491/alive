const express = require('express');
const cors = require('cors');
const guestLoginHandler = require('./guest-login-handler'); // We will extract logic
// const { db } = require('./lib/db'); // db connection might need fixing

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello from Express Monolith!" });
});

app.get('/api/gl', (req, res) => {
    res.json({ message: "GL endpoint working" });
});

// Guest Login Route - referencing extracted handler or inline
app.post('/api/guest-login', async (req, res) => {
    try {
        // Inline the logic for maximum safety first
        const handler = require('./guest-login');
        // guest-login.js default export is allowCors(handler), we need the raw handler or just call it
        // Since we are in Express, we don't need the Vercel allowCors helper wrapper.
        // Let's import the raw logic if possible, or just re-implement here to be safe.

        // Actually, let's just make guest-login.js usable.
        // But guest-login.js is currently wrapped in allowCors.
        // Let's use a simpler approach: forward request.
        return await handler(req, res);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fallback for API
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: "API Route Not Found", path: req.originalUrl });
});

module.exports = app;

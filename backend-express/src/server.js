/**
 * ALIVE Backend API Server
 * Express.js 實現
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const checkinRoutes = require('./routes/checkin');
const contactsRoutes = require('./routes/contacts');
const notificationsRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'ALIVE Backend is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/notifications', notificationsRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: '找不到此 API 路徑'
        }
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: {
            code: 'INTERNAL_ERROR',
            message: '伺服器錯誤'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ALIVE Backend running on port ${PORT}`);
});

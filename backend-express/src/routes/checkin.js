/**
 * Checkin Routes
 * 處理簽到相關的 API
 */

const express = require('express');
const router = express.Router();
const { db } = require('../lib/db');
const { checkIns } = require('../schema');
const { eq, desc } = require('drizzle-orm');
const { verifyToken } = require('../lib/auth');

// Middleware
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: { code: 'UNAUTHORIZED', message: '請先登入' }
        });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded.userId !== 'number') {
        return res.status(401).json({
            error: { code: 'UNAUTHORIZED', message: '請先登入' }
        });
    }

    req.userId = decoded.userId;
    next();
}

// POST /api/checkin
router.post('/', requireAuth, async (req, res) => {
    try {
        const { latitude, longitude, note } = req.body;

        const [checkIn] = await db.insert(checkIns).values({
            userId: req.userId,
            latitude: latitude || null,
            longitude: longitude || null,
            note: note || null,
        }).returning();

        res.status(201).json({ checkIn });
    } catch (error) {
        console.error('Checkin error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

// GET /api/checkin/history
router.get('/history', requireAuth, async (req, res) => {
    try {
        const { limit = '20', offset = '0' } = req.query;
        const limitNum = parseInt(limit);
        const offsetNum = parseInt(offset);

        const history = await db.select()
            .from(checkIns)
            .where(eq(checkIns.userId, req.userId))
            .orderBy(desc(checkIns.checkedAt))
            .limit(limitNum)
            .offset(offsetNum);

        res.json({ history, total: history.length });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

module.exports = router;

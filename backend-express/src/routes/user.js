/**
 * User Routes
 * 處理用戶資料相關的 API
 */

const express = require('express');
const router = express.Router();
const { db } = require('../lib/db');
const { users } = require('../schema');
const { eq } = require('drizzle-orm');
const { hashPassword, comparePassword, verifyToken } = require('../lib/auth');

// Middleware to verify auth
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

// GET /api/user/profile
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const [user] = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            phoneNumber: users.phoneNumber,
        }).from(users).where(eq(users.id, req.userId)).limit(1);

        if (!user) {
            return res.status(404).json({
                error: { code: 'USER_NOT_FOUND', message: '用戶不存在' }
            });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

// PUT /api/user/profile
router.put('/profile', requireAuth, async (req, res) => {
    try {
        const { name, phoneNumber } = req.body;

        if (!name) {
            return res.status(400).json({
                error: { code: 'INVALID_INPUT', message: '姓名為必填' }
            });
        }

        const [updatedUser] = await db.update(users).set({
            name,
            phoneNumber: phoneNumber || null,
        }).where(eq(users.id, req.userId)).returning({
            id: users.id,
            name: users.name,
            email: users.email,
            phoneNumber: users.phoneNumber,
        });

        res.json({ user: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

// POST /api/user/password
router.post('/password', requireAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                error: { code: 'INVALID_INPUT', message: '舊密碼和新密碼為必填' }
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                error: { code: 'INVALID_PASSWORD', message: '新密碼長度至少 6 個字元' }
            });
        }

        // 取得當前密碼
        const [user] = await db.select().from(users).where(eq(users.id, req.userId)).limit(1);

        if (!user) {
            return res.status(404).json({
                error: { code: 'USER_NOT_FOUND', message: '用戶不存在' }
            });
        }

        // 驗證舊密碼
        const isOldPasswordValid = await comparePassword(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({
                error: { code: 'INVALID_OLD_PASSWORD', message: '舊密碼錯誤' }
            });
        }

        // 更新密碼
        const hashedNewPassword = await hashPassword(newPassword);
        await db.update(users).set({ password: hashedNewPassword }).where(eq(users.id, req.userId));

        res.json({ message: '密碼更新成功' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

module.exports = router;

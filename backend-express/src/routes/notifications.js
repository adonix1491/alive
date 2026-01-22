/**
 * Notifications Routes
 * 處理通知設定相關的 API
 */

const express = require('express');
const router = express.Router();
const { db } = require('../lib/db');
const { notificationSettings } = require('../schema');
const { eq } = require('drizzle-orm');
const { verifyToken } = require('../lib/auth');
const { sendVerificationEmail, generateVerificationCode } = require('../lib/emailService');

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

// GET /api/notifications/settings
router.get('/settings', requireAuth, async (req, res) => {
    try {
        const [settings] = await db.select()
            .from(notificationSettings)
            .where(eq(notificationSettings.userId, req.userId))
            .limit(1);

        if (!settings) {
            return res.status(404).json({
                error: { code: 'SETTINGS_NOT_FOUND', message: '通知設定不存在' }
            });
        }

        res.json({ settings });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

// PUT /api/notifications/settings
router.put('/settings', requireAuth, async (req, res) => {
    try {
        const { emailEnabled, lineEnabled, notificationEmail } = req.body;

        const updateData = {};
        if (emailEnabled !== undefined) updateData.emailEnabled = emailEnabled;
        if (lineEnabled !== undefined) updateData.lineEnabled = lineEnabled;
        if (notificationEmail !== undefined) updateData.notificationEmail = notificationEmail || null;

        const [updatedSettings] = await db.update(notificationSettings)
            .set(updateData)
            .where(eq(notificationSettings.userId, req.userId))
            .returning();

        res.json({ settings: updatedSettings });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

// POST /api/notifications/verify-email
router.post('/verify-email', requireAuth, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: { code: 'INVALID_INPUT', message: 'Email 為必填' }
            });
        }

        // 檢查冷卻時間
        const [settings] = await db.select()
            .from(notificationSettings)
            .where(eq(notificationSettings.userId, req.userId))
            .limit(1);

        if (settings?.emailVerificationSentAt) {
            const cooldown = 60 * 1000; // 1 分鐘
            const timeSinceLastSent = Date.now() - settings.emailVerificationSentAt.getTime();
            if (timeSinceLastSent < cooldown) {
                const remainingSeconds = Math.ceil((cooldown - timeSinceLastSent) / 1000);
                return res.status(429).json({
                    error: { code: 'RATE_LIMIT', message: `請等待 ${remainingSeconds} 秒後再試` }
                });
            }
        }

        // 生成驗證碼
        const code = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 分鐘後過期

        // 更新設定
        await db.update(notificationSettings).set({
            notificationEmail: email,
            emailVerificationCode: code,
            emailVerificationExpiresAt: expiresAt,
            emailVerificationSentAt: new Date(),
        }).where(eq(notificationSettings.userId, req.userId));

        // 發送 Email
        try {
            await sendVerificationEmail(email, code);
            res.json({ message: '驗證碼已發送' });
        } catch (error) {
            console.error('Email send error:', error);
            res.status(500).json({
                error: { code: 'EMAIL_SEND_FAILED', message: 'Email 發送失敗' }
            });
        }
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

// POST /api/notifications/confirm-email
router.post('/confirm-email', requireAuth, async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                error: { code: 'INVALID_INPUT', message: '驗證碼為必填' }
            });
        }

        const [settings] = await db.select()
            .from(notificationSettings)
            .where(eq(notificationSettings.userId, req.userId))
            .limit(1);

        if (!settings) {
            return res.status(404).json({
                error: { code: 'SETTINGS_NOT_FOUND', message: '通知設定不存在' }
            });
        }

        // 驗證驗證碼
        if (settings.emailVerificationCode !== code) {
            return res.status(400).json({
                error: { code: 'INVALID_CODE', message: '驗證碼錯誤' }
            });
        }

        // 檢查是否過期
        if (!settings.emailVerificationExpiresAt || settings.emailVerificationExpiresAt < new Date()) {
            return res.status(400).json({
                error: { code: 'CODE_EXPIRED', message: '驗證碼已過期' }
            });
        }

        // 啟用 Email 通知
        await db.update(notificationSettings).set({
            emailEnabled: true,
            emailVerificationCode: null,
            emailVerificationExpiresAt: null,
        }).where(eq(notificationSettings.userId, req.userId));

        res.json({ message: 'Email 驗證成功' });
    } catch (error) {
        console.error('Confirm email error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

module.exports = router;

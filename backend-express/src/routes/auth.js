/**
 * Auth Routes
 * 處理認證相關的 API
 */

const express = require('express');
const router = express.Router();
const { db } = require('../lib/db');
const { users, notificationSettings } = require('../schema');
const { eq } = require('drizzle-orm');
const { hashPassword, comparePassword, generateToken } = require('../lib/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;

        // 驗證輸入
        if (!name || !email || !password) {
            return res.status(400).json({
                error: { code: 'INVALID_INPUT', message: '姓名、Email 和密碼為必填' }
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: { code: 'INVALID_PASSWORD', message: '密碼長度至少 6 個字元' }
            });
        }

        // 檢查 Email 是否已存在
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (existingUser.length > 0) {
            return res.status(409).json({
                error: { code: 'EMAIL_EXISTS', message: '此 Email 已被註冊' }
            });
        }

        // 加密密碼
        const hashedPassword = await hashPassword(password);

        // 建立用戶
        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            phoneNumber: phoneNumber || null,
        }).returning();

        // 建立預設通知設定
        await db.insert(notificationSettings).values({
            userId: newUser.id,
            emailEnabled: false,
            lineEnabled: false,
        });

        // 生成 Token
        const token = generateToken(newUser.id);

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: { code: 'INVALID_INPUT', message: 'Email 和密碼為必填' }
            });
        }

        // 查找用戶
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user) {
            return res.status(401).json({
                error: { code: 'INVALID_CREDENTIALS', message: 'Email 或密碼錯誤' }
            });
        }

        // 驗證密碼
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: { code: 'INVALID_CREDENTIALS', message: 'Email 或密碼錯誤' }
            });
        }

        // 生成 Token
        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: { code: 'UNAUTHORIZED', message: '請先登入' }
            });
        }

        const token = authHeader.substring(7);
        const { verifyToken } = require('../lib/auth');
        const decoded = verifyToken(token);

        if (!decoded || typeof decoded.userId !== 'number') {
            return res.status(401).json({
                error: { code: 'UNAUTHORIZED', message: '請先登入' }
            });
        }

        const [user] = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            phoneNumber: users.phoneNumber,
        }).from(users).where(eq(users.id, decoded.userId)).limit(1);

        if (!user) {
            return res.status(404).json({
                error: { code: 'USER_NOT_FOUND', message: '用戶不存在' }
            });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

module.exports = router;

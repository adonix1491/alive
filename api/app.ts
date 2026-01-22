/**
 * ALIVE Backend - Express API
 * Vercel Serverless Functions 架構
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { db } from './lib/db';
import { users, checkIns, emergencyContacts, notificationSettings } from './schema/schema';
import { eq, desc, and } from 'drizzle-orm';
import { hashPassword, comparePassword, generateToken, verifyToken } from './lib/auth';
import { sendVerificationEmail, generateVerificationCode } from './lib/emailService';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 認證中介層
async function authenticate(req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: '請先登入' } });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded.userId !== 'number') {
        return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: '請先登入' } });
    }

    req.userId = decoded.userId;
    next();
}

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'ALIVE Backend is running' });
});

// ==================== 認證 API ====================

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: { code: 'INVALID_INPUT', message: '姓名、Email 和密碼為必填' } });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: { code: 'INVALID_PASSWORD', message: '密碼長度至少 6 個字元' } });
        }

        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: '此 Email 已被註冊' } });
        }

        const hashedPassword = await hashPassword(password);

        const [newUser] = await db.insert(users).values({
            name, email, password: hashedPassword, phoneNumber: phoneNumber || null,
        }).returning();

        await db.insert(notificationSettings).values({
            userId: newUser.id, emailEnabled: false, lineEnabled: false,
        });

        const token = generateToken(newUser.id);

        res.status(201).json({
            token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email, phoneNumber: newUser.phoneNumber },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Email 和密碼為必填' } });
        }

        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user) {
            return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Email 或密碼錯誤' } });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Email 或密碼錯誤' } });
        }

        const token = generateToken(user.id);

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, phoneNumber: user.phoneNumber },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

app.get('/api/auth/me', authenticate, async (req: any, res) => {
    try {
        const [user] = await db.select({
            id: users.id, name: users.name, email: users.email, phoneNumber: users.phoneNumber,
        }).from(users).where(eq(users.id, req.userId)).limit(1);

        if (!user) {
            return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: '用戶不存在' } });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

// ==================== 用戶 API ====================

app.get('/api/user/profile', authenticate, async (req: any, res) => {
    try {
        const [user] = await db.select({
            id: users.id, name: users.name, email: users.email, phoneNumber: users.phoneNumber,
        }).from(users).where(eq(users.id, req.userId)).limit(1);

        if (!user) {
            return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: '用戶不存在' } });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

app.put('/api/user/profile', authenticate, async (req: any, res) => {
    try {
        const { name, phoneNumber } = req.body;

        if (!name) {
            return res.status(400).json({ error: { code: 'INVALID_INPUT', message: '姓名為必填' } });
        }

        const [updatedUser] = await db.update(users).set({
            name, phoneNumber: phoneNumber || null,
        }).where(eq(users.id, req.userId)).returning({
            id: users.id, name: users.name, email: users.email, phoneNumber: users.phoneNumber,
        });

        res.json({ user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

app.post('/api/user/password', authenticate, async (req: any, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: { code: 'INVALID_INPUT', message: '舊密碼和新密碼為必填' } });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: { code: 'INVALID_PASSWORD', message: '新密碼長度至少 6 個字元' } });
        }

        const [user] = await db.select().from(users).where(eq(users.id, req.userId)).limit(1);
        if (!user) {
            return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: '用戶不存在' } });
        }

        const isOldPasswordValid = await comparePassword(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({ error: { code: 'INVALID_OLD_PASSWORD', message: '舊密碼錯誤' } });
        }

        const hashedNewPassword = await hashPassword(newPassword);
        await db.update(users).set({ password: hashedNewPassword }).where(eq(users.id, req.userId));

        res.json({ message: '密碼更新成功' });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

// ==================== 簽到 API ====================

app.post('/api/checkin', authenticate, async (req: any, res) => {
    try {
        const { latitude, longitude, note } = req.body;

        const [checkIn] = await db.insert(checkIns).values({
            userId: req.userId, latitude: latitude || null, longitude: longitude || null, note: note || null,
        }).returning();

        res.status(201).json({ checkIn });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

app.get('/api/checkin/history', authenticate, async (req: any, res) => {
    try {
        const { limit = '20', offset = '0' } = req.query;
        const limitNum = parseInt(limit as string);
        const offsetNum = parseInt(offset as string);

        const history = await db.select().from(checkIns)
            .where(eq(checkIns.userId, req.userId))
            .orderBy(desc(checkIns.checkedAt))
            .limit(limitNum).offset(offsetNum);

        res.json({ history, total: history.length });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

// ==================== 聯絡人 API ====================

app.get('/api/contacts', authenticate, async (req: any, res) => {
    try {
        const contacts = await db.select().from(emergencyContacts)
            .where(eq(emergencyContacts.userId, req.userId));

        res.json({ contacts });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

app.post('/api/contacts', authenticate, async (req: any, res) => {
    try {
        const { name, relationship, phoneNumber, email } = req.body;

        if (!name || !phoneNumber) {
            return res.status(400).json({ error: { code: 'INVALID_INPUT', message: '姓名和電話為必填' } });
        }

        const existingContacts = await db.select().from(emergencyContacts)
            .where(eq(emergencyContacts.userId, req.userId));

        if (existingContacts.length >= 5) {
            return res.status(400).json({ error: { code: 'MAX_CONTACTS_REACHED', message: '最多只能新增 5 位緊急聯絡人' } });
        }

        const [contact] = await db.insert(emergencyContacts).values({
            userId: req.userId, name, relationship: relationship || null, phoneNumber, email: email || null,
        }).returning();

        res.status(201).json({ contact });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

app.put('/api/contacts/:id', authenticate, async (req: any, res) => {
    try {
        const contactId = parseInt(req.params.id);
        const { name, relationship, phoneNumber, email } = req.body;

        if (!name || !phoneNumber) {
            return res.status(400).json({ error: { code: 'INVALID_INPUT', message: '姓名和電話為必填' } });
        }

        const [contact] = await db.select().from(emergencyContacts).where(and(
            eq(emergencyContacts.id, contactId), eq(emergencyContacts.userId, req.userId)
        )).limit(1);

        if (!contact) {
            return res.status(404).json({ error: { code: 'CONTACT_NOT_FOUND', message: '聯絡人不存在' } });
        }

        const [updatedContact] = await db.update(emergencyContacts).set({
            name, relationship: relationship || null, phoneNumber, email: email || null,
        }).where(eq(emergencyContacts.id, contactId)).returning();

        res.json({ contact: updatedContact });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

app.delete('/api/contacts/:id', authenticate, async (req: any, res) => {
    try {
        const contactId = parseInt(req.params.id);

        const [contact] = await db.select().from(emergencyContacts).where(and(
            eq(emergencyContacts.id, contactId), eq(emergencyContacts.userId, req.userId)
        )).limit(1);

        if (!contact) {
            return res.status(404).json({ error: { code: 'CONTACT_NOT_FOUND', message: '聯絡人不存在' } });
        }

        await db.delete(emergencyContacts).where(eq(emergencyContacts.id, contactId));

        res.json({ message: '聯絡人已刪除' });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

// ==================== 通知 API ====================

app.get('/api/notifications/settings', authenticate, async (req: any, res) => {
    try {
        const [settings] = await db.select().from(notificationSettings)
            .where(eq(notificationSettings.userId, req.userId)).limit(1);

        if (!settings) {
            return res.status(404).json({ error: { code: 'SETTINGS_NOT_FOUND', message: '通知設定不存在' } });
        }

        res.json({ settings });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

app.put('/api/notifications/settings', authenticate, async (req: any, res) => {
    try {
        const { emailEnabled, lineEnabled, notificationEmail } = req.body;

        const [updatedSettings] = await db.update(notificationSettings).set({
            emailEnabled: emailEnabled ?? undefined,
            lineEnabled: lineEnabled ?? undefined,
            notificationEmail: notificationEmail || null,
        }).where(eq(notificationSettings.userId, req.userId)).returning();

        res.json({ settings: updatedSettings });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

app.post('/api/notifications/verify-email', authenticate, async (req: any, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Email 為必填' } });
        }

        const [settings] = await db.select().from(notificationSettings)
            .where(eq(notificationSettings.userId, req.userId)).limit(1);

        if (settings?.emailVerificationSentAt) {
            const cooldown = 60 * 1000;
            const timeSinceLastSent = Date.now() - settings.emailVerificationSentAt.getTime();
            if (timeSinceLastSent < cooldown) {
                const remainingSeconds = Math.ceil((cooldown - timeSinceLastSent) / 1000);
                return res.status(429).json({
                    error: { code: 'RATE_LIMIT', message: `請等待 ${remainingSeconds} 秒後再試` }
                });
            }
        }

        const code = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await db.update(notificationSettings).set({
            notificationEmail: email,
            emailVerificationCode: code,
            emailVerificationExpiresAt: expiresAt,
            emailVerificationSentAt: new Date(),
        }).where(eq(notificationSettings.userId, req.userId));

        try {
            await sendVerificationEmail(email, code);
            res.json({ message: '驗證碼已發送' });
        } catch (error) {
            res.status(500).json({ error: { code: 'EMAIL_SEND_FAILED', message: 'Email 發送失敗' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

app.post('/api/notifications/confirm-email', authenticate, async (req: any, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: { code: 'INVALID_INPUT', message: '驗證碼為必填' } });
        }

        const [settings] = await db.select().from(notificationSettings)
            .where(eq(notificationSettings.userId, req.userId)).limit(1);

        if (!settings) {
            return res.status(404).json({ error: { code: 'SETTINGS_NOT_FOUND', message: '通知設定不存在' } });
        }

        if (settings.emailVerificationCode !== code) {
            return res.status(400).json({ error: { code: 'INVALID_CODE', message: '驗證碼錯誤' } });
        }

        if (!settings.emailVerificationExpiresAt || settings.emailVerificationExpiresAt < new Date()) {
            return res.status(400).json({ error: { code: 'CODE_EXPIRED', message: '驗證碼已過期' } });
        }

        await db.update(notificationSettings).set({
            emailEnabled: true,
            emailVerificationCode: null,
            emailVerificationExpiresAt: null,
        }).where(eq(notificationSettings.userId, req.userId));

        res.json({ message: 'Email 驗證成功' });
    } catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: '找不到此 API 路徑' } });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
});

export default app;

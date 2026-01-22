/**
 * ALIVE 統一 API Handler
 * 處理所有 API 請求並路由到對應的邏輯
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './lib/db';
import { users, checkIns, emergencyContacts, notificationSettings } from '../backend/db/schema';
import { eq, desc, and, gte } from 'drizzle-orm';
import {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
} from './lib/auth';
import {
    sendVerificationEmail,
    generateVerificationCode
} from './lib/emailService';

/**
 * CORS 設定
 */
function setCORS(res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * 錯誤回應
 */
function sendError(res: VercelResponse, statusCode: number, code: string, message: string) {
    return res.status(statusCode).json({
        error: { code, message }
    });
}

/**
 * 成功回應
 */
function sendSuccess(res: VercelResponse, data: any, statusCode: number = 200) {
    return res.status(statusCode).json(data);
}

/**
 * 從請求中提取並驗證 JWT Token
 */
async function authenticateRequest(req: VercelRequest): Promise<{ userId: number } | null> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded.userId !== 'number') {
        return null;
    }

    return { userId: decoded.userId };
}

/**
 * 主要 API Handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 處理 CORS
    setCORS(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // 解析路徑
        const path = (req.url || '').replace('/api', '').split('?')[0];
        const method = req.method || 'GET';

        // ==================== 認證相關 API ====================

        // POST /api/auth/register
        if (path === '/auth/register' && method === 'POST') {
            const { name, email, password, phoneNumber } = req.body;

            // 驗證輸入
            if (!name || !email || !password) {
                return sendError(res, 400, 'INVALID_INPUT', '姓名、Email 和密碼為必填');
            }

            if (password.length < 6) {
                return sendError(res, 400, 'INVALID_PASSWORD', '密碼長度至少 6 個字元');
            }

            // 檢查 Email 是否已存在
            const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (existingUser.length > 0) {
                return sendError(res, 409, 'EMAIL_EXISTS', '此 Email 已被註冊');
            }

            // 加密密碼
            const hashedPassword = await hashPassword(password);

            // 建立用戶
            const [newUser] = await db
                .insert(users)
                .values({
                    name,
                    email,
                    password: hashedPassword,
                    phoneNumber: phoneNumber || null,
                })
                .returning();

            // 建立預設通知設定
            await db.insert(notificationSettings).values({
                userId: newUser.id,
                emailEnabled: false,
                lineEnabled: false,
            });

            // 生成 Token
            const token = generateToken(newUser.id);

            return sendSuccess(res, {
                token,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    phoneNumber: newUser.phoneNumber,
                },
            }, 201);
        }

        // POST /api/auth/login
        if (path === '/auth/login' && method === 'POST') {
            const { email, password } = req.body;

            if (!email || !password) {
                return sendError(res, 400, 'INVALID_INPUT', 'Email 和密碼為必填');
            }

            // 查找用戶
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (!user) {
                return sendError(res, 401, 'INVALID_CREDENTIALS', 'Email 或密碼錯誤');
            }

            // 驗證密碼
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return sendError(res, 401, 'INVALID_CREDENTIALS', 'Email 或密碼錯誤');
            }

            // 生成 Token
            const token = generateToken(user.id);

            return sendSuccess(res, {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                },
            });
        }

        // GET /api/auth/me
        if (path === '/auth/me' && method === 'GET') {
            const auth = await authenticateRequest(req);
            if (!auth) {
                return sendError(res, 401, 'UNAUTHORIZED', '請先登入');
            }

            const [user] = await db
                .select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    phoneNumber: users.phoneNumber,
                })
                .from(users)
                .where(eq(users.id, auth.userId))
                .limit(1);

            if (!user) {
                return sendError(res, 404, 'USER_NOT_FOUND', '用戶不存在');
            }

            return sendSuccess(res, { user });
        }

        // ==================== 用戶資料 API ====================

        // GET/PUT /api/user/profile
        if (path === '/user/profile') {
            const auth = await authenticateRequest(req);
            if (!auth) {
                return sendError(res, 401, 'UNAUTHORIZED', '請先登入');
            }

            if (method === 'GET') {
                const [user] = await db
                    .select({
                        id: users.id,
                        name: users.name,
                        email: users.email,
                        phoneNumber: users.phoneNumber,
                    })
                    .from(users)
                    .where(eq(users.id, auth.userId))
                    .limit(1);

                if (!user) {
                    return sendError(res, 404, 'USER_NOT_FOUND', '用戶不存在');
                }

                return sendSuccess(res, { user });
            }

            if (method === 'PUT') {
                const { name, phoneNumber } = req.body;

                if (!name) {
                    return sendError(res, 400, 'INVALID_INPUT', '姓名為必填');
                }

                const [updatedUser] = await db
                    .update(users)
                    .set({
                        name,
                        phoneNumber: phoneNumber || null,
                    })
                    .where(eq(users.id, auth.userId))
                    .returning({
                        id: users.id,
                        name: users.name,
                        email: users.email,
                        phoneNumber: users.phoneNumber,
                    });

                return sendSuccess(res, { user: updatedUser });
            }
        }

        // POST /api/user/password
        if (path === '/user/password' && method === 'POST') {
            const auth = await authenticateRequest(req);
            if (!auth) {
                return sendError(res, 401, 'UNAUTHORIZED', '請先登入');
            }

            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                return sendError(res, 400, 'INVALID_INPUT', '舊密碼和新密碼為必填');
            }

            if (newPassword.length < 6) {
                return sendError(res, 400, 'INVALID_PASSWORD', '新密碼長度至少 6 個字元');
            }

            // 取得當前密碼
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.id, auth.userId))
                .limit(1);

            if (!user) {
                return sendError(res, 404, 'USER_NOT_FOUND', '用戶不存在');
            }

            // 驗證舊密碼
            const isOldPasswordValid = await comparePassword(oldPassword, user.password);
            if (!isOldPasswordValid) {
                return sendError(res, 401, 'INVALID_OLD_PASSWORD', '舊密碼錯誤');
            }

            // 更新密碼
            const hashedNewPassword = await hashPassword(newPassword);
            await db
                .update(users)
                .set({ password: hashedNewPassword })
                .where(eq(users.id, auth.userId));

            return sendSuccess(res, { message: '密碼更新成功' });
        }

        // ==================== 簽到 API ====================

        // POST /api/checkin
        if (path === '/checkin' && method === 'POST') {
            const auth = await authenticateRequest(req);
            if (!auth) {
                return sendError(res, 401, 'UNAUTHORIZED', '請先登入');
            }

            const { latitude, longitude, note } = req.body;

            const [checkIn] = await db
                .insert(checkIns)
                .values({
                    userId: auth.userId,
                    latitude: latitude || null,
                    longitude: longitude || null,
                    note: note || null,
                })
                .returning();

            return sendSuccess(res, { checkIn }, 201);
        }

        // GET /api/checkin/history
        if (path === '/checkin/history' && method === 'GET') {
            const auth = await authenticateRequest(req);
            if (!auth) {
                return sendError(res, 401, 'UNAUTHORIZED', '請先登入');
            }

            const { limit = '20', offset = '0' } = req.query;
            const limitNum = parseInt(limit as string);
            const offsetNum = parseInt(offset as string);

            const history = await db
                .select()
                .from(checkIns)
                .where(eq(checkIns.userId, auth.userId))
                .orderBy(desc(checkIns.checkedAt))
                .limit(limitNum)
                .offset(offsetNum);

            return sendSuccess(res, { history, total: history.length });
        }

        // ==================== 緊急聯絡人 API ====================

        // GET/POST /api/contacts
        if (path === '/contacts') {
            const auth = await authenticateRequest(req);
            if (!auth) {
                return sendError(res, 401, 'UNAUTHORIZED', '請先登入');
            }

            if (method === 'GET') {
                const contacts = await db
                    .select()
                    .from(emergencyContacts)
                    .where(eq(emergencyContacts.userId, auth.userId));

                return sendSuccess(res, { contacts });
            }

            if (method === 'POST') {
                const { name, relationship, phoneNumber, email } = req.body;

                if (!name || !phoneNumber) {
                    return sendError(res, 400, 'INVALID_INPUT', '姓名和電話為必填');
                }

                // 檢查聯絡人數量限制
                const existingContacts = await db
                    .select()
                    .from(emergencyContacts)
                    .where(eq(emergencyContacts.userId, auth.userId));

                if (existingContacts.length >= 5) {
                    return sendError(res, 400, 'MAX_CONTACTS_REACHED', '最多只能新增 5 位緊急聯絡人');
                }

                const [contact] = await db
                    .insert(emergencyContacts)
                    .values({
                        userId: auth.userId,
                        name,
                        relationship: relationship || null,
                        phoneNumber,
                        email: email || null,
                    })
                    .returning();

                return sendSuccess(res, { contact }, 201);
            }
        }

        // PUT/DELETE /api/contacts/:id
        const contactIdMatch = path.match(/^\/contacts\/(\d+)$/);
        if (contactIdMatch) {
            const auth = await authenticateRequest(req);
            if (!auth) {
                return sendError(res, 401, 'UNAUTHORIZED', '請先登入');
            }

            const contactId = parseInt(contactIdMatch[1]);

            // 驗證聯絡人屬於當前用戶
            const [contact] = await db
                .select()
                .from(emergencyContacts)
                .where(
                    and(
                        eq(emergencyContacts.id, contactId),
                        eq(emergencyContacts.userId, auth.userId)
                    )
                )
                .limit(1);

            if (!contact) {
                return sendError(res, 404, 'CONTACT_NOT_FOUND', '聯絡人不存在');
            }

            if (method === 'PUT') {
                const { name, relationship, phoneNumber, email } = req.body;

                if (!name || !phoneNumber) {
                    return sendError(res, 400, 'INVALID_INPUT', '姓名和電話為必填');
                }

                const [updatedContact] = await db
                    .update(emergencyContacts)
                    .set({
                        name,
                        relationship: relationship || null,
                        phoneNumber,
                        email: email || null,
                    })
                    .where(eq(emergencyContacts.id, contactId))
                    .returning();

                return sendSuccess(res, { contact: updatedContact });
            }

            if (method === 'DELETE') {
                await db
                    .delete(emergencyContacts)
                    .where(eq(emergencyContacts.id, contactId));

                return sendSuccess(res, { message: '聯絡人已刪除' });
            }
        }

        // ==================== 通知設定 API ====================

        // GET/PUT /api/notifications/settings
        if (path === '/notifications/settings') {
            const auth = await authenticateRequest(req);
            if (!auth) {
                return sendError(res, 401, 'UNAUTHORIZED', '請先登入');
            }

            if (method === 'GET') {
                const [settings] = await db
                    .select()
                    .from(notificationSettings)
                    .where(eq(notificationSettings.userId, auth.userId))
                    .limit(1);

                if (!settings) {
                    return sendError(res, 404, 'SETTINGS_NOT_FOUND', '通知設定不存在');
                }

                return sendSuccess(res, { settings });
            }

            if (method === 'PUT') {
                const { emailEnabled, lineEnabled, notificationEmail } = req.body;

                const [updatedSettings] = await db
                    .update(notificationSettings)
                    .set({
                        emailEnabled: emailEnabled ?? undefined,
                        lineEnabled: lineEnabled ?? undefined,
                        notificationEmail: notificationEmail || null,
                    })
                    .where(eq(notificationSettings.userId, auth.userId))
                    .returning();

                return sendSuccess(res, { settings: updatedSettings });
            }
        }

        // POST /api/notifications/verify-email
        if (path === '/notifications/verify-email' && method === 'POST') {
            const auth = await authenticateRequest(req);
            if (!auth) {
                return sendError(res, 401, 'UNAUTHORIZED', '請先登入');
            }

            const { email } = req.body;

            if (!email) {
                return sendError(res, 400, 'INVALID_INPUT', 'Email 為必填');
            }

            // 檢查冷卻時間
            const [settings] = await db
                .select()
                .from(notificationSettings)
                .where(eq(notificationSettings.userId, auth.userId))
                .limit(1);

            if (settings?.emailVerificationSentAt) {
                const cooldown = 60 * 1000; // 1 分鐘
                const timeSinceLastSent = Date.now() - settings.emailVerificationSentAt.getTime();
                if (timeSinceLastSent < cooldown) {
                    const remainingSeconds = Math.ceil((cooldown - timeSinceLastSent) / 1000);
                    return sendError(
                        res,
                        429,
                        'RATE_LIMIT',
                        `請等待 ${remainingSeconds} 秒後再試`
                    );
                }
            }

            // 生成驗證碼
            const code = generateVerificationCode();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 分鐘後過期

            // 更新設定
            await db
                .update(notificationSettings)
                .set({
                    notificationEmail: email,
                    emailVerificationCode: code,
                    emailVerificationExpiresAt: expiresAt,
                    emailVerificationSentAt: new Date(),
                })
                .where(eq(notificationSettings.userId, auth.userId));

            // 發送 Email
            try {
                await sendVerificationEmail(email, code);
                return sendSuccess(res, { message: '驗證碼已發送' });
            } catch (error) {
                return sendError(res, 500, 'EMAIL_SEND_FAILED', 'Email 發送失敗');
            }
        }

        // POST /api/notifications/confirm-email
        if (path === '/notifications/confirm-email' && method === 'POST') {
            const auth = await authenticateRequest(req);
            if (!auth) {
                return sendError(res, 401, 'UNAUTHORIZED', '請先登入');
            }

            const { code } = req.body;

            if (!code) {
                return sendError(res, 400, 'INVALID_INPUT', '驗證碼為必填');
            }

            const [settings] = await db
                .select()
                .from(notificationSettings)
                .where(eq(notificationSettings.userId, auth.userId))
                .limit(1);

            if (!settings) {
                return sendError(res, 404, 'SETTINGS_NOT_FOUND', '通知設定不存在');
            }

            // 驗證驗證碼
            if (settings.emailVerificationCode !== code) {
                return sendError(res, 400, 'INVALID_CODE', '驗證碼錯誤');
            }

            // 檢查是否過期
            if (!settings.emailVerificationExpiresAt || settings.emailVerificationExpiresAt < new Date()) {
                return sendError(res, 400, 'CODE_EXPIRED', '驗證碼已過期');
            }

            // 啟用 Email 通知
            await db
                .update(notificationSettings)
                .set({
                    emailEnabled: true,
                    emailVerificationCode: null,
                    emailVerificationExpiresAt: null,
                })
                .where(eq(notificationSettings.userId, auth.userId));

            return sendSuccess(res, { message: 'Email 驗證成功' });
        }

        // 404 - 路徑不存在
        return sendError(res, 404, 'NOT_FOUND', '找不到此 API 路徑');

    } catch (error: any) {
        console.error('API Error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '伺服器錯誤');
    }
}

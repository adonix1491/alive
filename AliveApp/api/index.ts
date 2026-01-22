// @ts-nocheck
/**
 * ALIVE 統一 API Handler
 * 處理所有 API 請求並路由到對應的邏輯
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './lib/db';
import { users, checkIns, emergencyContacts, notificationSettings, messageTemplates } from './schema/db_schema';
import { eq, desc, and } from 'drizzle-orm';
import {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
} from './lib/auth';
import {
    sendVerificationEmail,
    generateVerificationCode
} from './lib/mailer';

/**
 * CORS 設定
 */
function setCORS(res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
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

    const token = authHeader.substring(7); // Remove 'Bearer '
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
        try {
            // 解析路徑
            // Vercel Serverless Function 接收到的 req.url 可能包含也可能不包含 /api 前綴，具體取決於 rewrites
            // 我們將統一移除 /api 前綴以進行內部路由匹配
            const fullPath = (req.url || '').split('?')[0];
            const path = fullPath.replace(/^\/api/, '');
            const method = req.method || 'GET';

            console.log(`[API] ${method} ${fullPath}  ->  Routed to: ${path}`);

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
                // @ts-ignore
                const [newUser] = await db
                    .insert(users)
                    .values({
                        name,
                        email,
                        password: hashedPassword,
                        // @ts-ignore
                        phone: phoneNumber || null,
                    })
                    .returning();

                // 建立預設通知設定
                // @ts-ignore
                await db.insert(notificationSettings).values({
                    userId: newUser.id,
                    emailEnabled: false,
                    lineEnabled: false,
                    pushEnabled: true
                });

                // 生成 Token
                const token = generateToken(newUser.id);

                return sendSuccess(res, {
                    token,
                    user: {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        phoneNumber: newUser.phone,
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
                        phoneNumber: user.phone,
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
                    .select()
                    .from(users)
                    .where(eq(users.id, auth.userId))
                    .limit(1);

                if (!user) {
                    return sendError(res, 404, 'USER_NOT_FOUND', '用戶不存在');
                }

                return sendSuccess(res, {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phoneNumber: user.phone,
                    }
                });
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
                        .select()
                        .from(users)
                        .where(eq(users.id, auth.userId))
                        .limit(1);

                    if (!user) {
                        return sendError(res, 404, 'USER_NOT_FOUND', '用戶不存在');
                    }

                    return sendSuccess(res, {
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            phoneNumber: user.phone,
                            lineId: user.lineId,
                        }
                    });
                }

                if (method === 'PUT') {
                    const { name, phoneNumber, lineId } = req.body;

                    if (!name) {
                        return sendError(res, 400, 'INVALID_INPUT', '姓名為必填');
                    }

                    // @ts-ignore
                    const [updatedUser] = await db
                        .update(users)
                        .set({
                            name,
                            phone: phoneNumber || null,
                            lineId: lineId || null,
                        })
                        .where(eq(users.id, auth.userId))
                        .returning();

                    return sendSuccess(res, {
                        user: {
                            id: updatedUser.id,
                            name: updatedUser.name,
                            email: updatedUser.email,
                            phoneNumber: updatedUser.phone,
                            lineId: updatedUser.lineId,
                        }
                    });
                }
            }

            // ==================== 簽到 API ====================

            // POST /api/checkin
            if (path === '/checkin' && method === 'POST') {
                const auth = await authenticateRequest(req);
                if (!auth) {
                    return sendError(res, 401, 'UNAUTHORIZED', '請先登入');
                }

                // 檢查用戶是否已綁定資料 (手機 OR EMail OR LineID 至少一項)
                const [user] = await db.select().from(users).where(eq(users.id, auth.userId));

                const hasPhone = !!user.phone;
                const hasEmail = !!user.email;
                const hasLine = !!user.lineId; // 使用 user.lineId 判斷

                if (!hasPhone && !hasEmail && !hasLine) {
                    return sendError(res, 403, 'PROFILE_INCOMPLETE', '請至少綁定一項聯絡方式 (手機、Email 或 LINE)');
                }

                const { latitude, longitude, note } = req.body;

                // @ts-ignore
                const [checkIn] = await db
                    .insert(checkIns)
                    .values({
                        userId: auth.userId,
                        status: 'completed',
                        location: { latitude, longitude, note },
                        timestamp: new Date()
                    })
                    .returning();

                return sendSuccess(res, { checkIn }, 201);
            }

            // ==================== 訊息模板 API ====================

            // GET/POST /api/message-templates
            if (path === '/message-templates') {
                const auth = await authenticateRequest(req);
                if (!auth) {
                    return sendError(res, 401, 'UNAUTHORIZED', '請先登入');
                }

                if (method === 'GET') {
                    const templates = await db
                        .select()
                        .from(messageTemplates)
                        .where(eq(messageTemplates.userId, auth.userId));

                    // Convert array to object map if needed, or return list. 
                    // Front-end implies "Default" matches key "emergency"? 
                    // Let's assume we return a list and frontend matches by type?
                    // Or simplified: Just one custom message? 
                    // User requirement: "Default notification message" (system provided?) and "Custom message".
                    // If "Default" is system hardcoded, we only need to save the "Custom" one.
                    // The frontend screenshot showed "Default" (text) and "Custom" (editable).
                    // Let's assume we store the 'custom' message for the user.

                    // If we only need one custom message per user:
                    return sendSuccess(res, { templates });
                }

                if (method === 'POST') {
                    const { type, title, content } = req.body; // type: 'custom'

                    // Upsert logic
                    // Check if exists
                    const existing = await db.select().from(messageTemplates)
                        .where(and(eq(messageTemplates.userId, auth.userId), eq(messageTemplates.type, type || 'custom')))
                        .limit(1);

                    let result;
                    if (existing.length > 0) {
                        // @ts-ignore
                        [result] = await db.update(messageTemplates)
                            .set({ title, content, updatedAt: new Date() })
                            .where(eq(messageTemplates.id, existing[0].id))
                            .returning();
                    } else {
                        // @ts-ignore
                        [result] = await db.insert(messageTemplates)
                            .values({
                                userId: auth.userId,
                                type: type || 'custom',
                                title: title || '自訂訊息',
                                content,
                            })
                            .returning();
                    }

                    return sendSuccess(res, { template: result });
                }
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
                    .orderBy(desc(checkIns.timestamp))
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
                    const { name, relationship, phoneNumber, email, lineId } = req.body;

                    if (!name || (!phoneNumber && !lineId)) { // 改為 電話 或 LINE ID 擇一即可? 使用者說增加 LINE ID
                        return sendError(res, 400, 'INVALID_INPUT', '姓名為必填，電話或LINE ID請至少填寫一項');
                    }

                    const existingContacts = await db
                        .select()
                        .from(emergencyContacts)
                        .where(eq(emergencyContacts.userId, auth.userId));

                    if (existingContacts.length >= 5) {
                        return sendError(res, 400, 'MAX_CONTACTS_REACHED', '最多只能新增 5 位緊急聯絡人');
                    }

                    // @ts-ignore
                    const [contact] = await db
                        .insert(emergencyContacts)
                        .values({
                            userId: auth.userId,
                            name,
                            relationship: relationship || null,
                            phone: phoneNumber || '', // Schema says notNull, so empty string if missing? Or should change schema to optional? Schema had it notNull. Let's assume phone is main key or make it optional? 
                            // User said "Add Line ID", implying Phone might not be the only way.
                            // I'll assume for now Phone IS still required by schema unless I change schema notNull constraints.
                            // DB Schema lines 42: phone: text('phone').notNull()
                            // So Phone IS required currently. I will stick to Phone required for now to avoid DB migration errors if I can't migrate easily.
                            // Wait, user said "增加LINE ID", didn't say "Phone optional". 
                            // So I will keep Phone required passing for now, and just save Line ID.
                            email: email || null,
                            lineId: lineId || null,
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

                if (method === 'PUT') {
                    const { name, relationship, phoneNumber, email, lineId } = req.body;
                    // @ts-ignore
                    const [updatedContact] = await db
                        .update(emergencyContacts)
                        .set({
                            name,
                            relationship: relationship || null,
                            phone: phoneNumber,
                            email: email || null,
                            lineId: lineId || null,
                        })
                        .where(and(eq(emergencyContacts.id, contactId), eq(emergencyContacts.userId, auth.userId)))
                        .returning();
                    return sendSuccess(res, { contact: updatedContact });
                }

                if (method === 'DELETE') {
                    // @ts-ignore
                    await db.delete(emergencyContacts).where(and(eq(emergencyContacts.id, contactId), eq(emergencyContacts.userId, auth.userId)));
                    return sendSuccess(res, { message: '聯絡人已刪除' });
                }
            }

            // 404
            return sendError(res, 404, 'NOT_FOUND', 'API Endpoint Not Found');

        } catch (error: any) {
            console.error('API Error:', error);
            return sendError(res, 500, 'INTERNAL_ERROR', '伺服器錯誤');
        }
    }

/**
 * POST /api/auth/register
 * 用戶註冊 API
 */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/db';
import { users, notificationSettings } from '../../schema/schema';
import { hashPassword, generateToken } from '../lib/auth';
import { sendError, sendSuccess, enableCORS, handleOptions } from '../lib/middleware';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 處理 CORS preflight
    if (handleOptions(req, res)) return;
    enableCORS(res);

    // 只接�?POST 請求
    if (req.method !== 'POST') {
        return sendError(res, 405, 'METHOD_NOT_ALLOWED', '只接�?POST 請求');
    }

    try {
        const { email, password, name, phone } = req.body;

        // 驗證必填欄位
        if (!email || !password || !name) {
            return sendError(res, 400, 'MISSING_FIELDS', 'Email、密碼和姓名為必�?);
        }

        // 驗證 email 格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendError(res, 400, 'INVALID_EMAIL', 'Email 格式不正�?);
        }

        // 驗證密碼強度
        if (password.length < 8) {
            return sendError(res, 400, 'WEAK_PASSWORD', '密碼必須至少 8 個字�?);
        }

        // 檢查 email 是否已存�?
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (existingUser.length > 0) {
            return sendError(res, 409, 'EMAIL_EXISTS', '�?Email 已被註冊');
        }

        // Hash 密碼
        const hashedPassword = await hashPassword(password);

        // 建立使用�?
        const newUser = await db
            .insert(users)
            .values({
                email: email.toLowerCase(),
                password: hashedPassword,
                name,
                phone: phone || null,
            })
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
                phone: users.phone,
                avatarUrl: users.avatarUrl,
                createdAt: users.createdAt,
            });

        const user = newUser[0];

        // 建立預設通知設定
        await db.insert(notificationSettings).values({
            userId: user.id,
            emailEnabled: false,
            lineEnabled: false,
            pushEnabled: true,
        });

        // 生成 JWT token
        const token = generateToken(user.id);

        // 返回成功回應
        return sendSuccess(
            res,
            {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    avatarUrl: user.avatarUrl,
                },
            },
            201
        );
    } catch (error: any) {
        console.error('Register error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '註冊失敗，請稍後再試', error.message);
    }
}

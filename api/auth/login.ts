/**
 * POST /api/auth/login
 * 用戶登入 API
 */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/db';
import { users } from '../../schema/schema';
import { comparePassword, generateToken } from '../lib/auth';
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
        const { email, password } = req.body;

        // 驗證必填欄位
        if (!email || !password) {
            return sendError(res, 400, 'MISSING_FIELDS', 'Email 和密碼為必填');
        }

        // 查詢使用�?
        const userResult = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (userResult.length === 0) {
            return sendError(res, 401, 'INVALID_CREDENTIALS', 'Email 或密碼錯�?);
        }

        const user = userResult[0];

        // 驗證密碼
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return sendError(res, 401, 'INVALID_CREDENTIALS', 'Email 或密碼錯�?);
        }

        // 生成 JWT token
        const token = generateToken(user.id);

        // 返回成功回應（不包含密碼�?
        return sendSuccess(res, {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
            },
        });
    } catch (error: any) {
        console.error('Login error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '登入失敗，請稍後再試', error.message);
    }
}

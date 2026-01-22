/**
 * POST /api/notifications/verify-email
 * 發�?Email 驗證�?API
 */
import { VercelResponse } from '@vercel/node';
import { db } from '../lib/db';
import { notificationSettings } from '../../schema/schema';
import { sendVerificationEmail, generateVerificationCode } from '../lib/emailService';
import { sendError, sendSuccess, requireAuth, AuthenticatedRequest, enableCORS, handleOptions } from '../lib/middleware';
import { eq } from 'drizzle-orm';

// 儲存驗證碼（實際應用應該�?Redis 或資料庫�?
// 這裡為了簡化，暫時用記憶體存�?
const verificationCodes: Map<number, { code: string; email: string; expiresAt: Date }> = new Map();

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    enableCORS(res);

    if (req.method !== 'POST') {
        return sendError(res, 405, 'METHOD_NOT_ALLOWED', '只接�?POST 請求');
    }

    const userId = req.userId!;

    try {
        const { email } = req.body;

        // 驗證 email 格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return sendError(res, 400, 'INVALID_EMAIL', 'Email 格式不正�?);
        }

        // 檢查是否在冷卻期間（防止濫用�?
        const existingCode = verificationCodes.get(userId);
        if (existingCode && existingCode.expiresAt > new Date()) {
            const remainingTime = Math.ceil((existingCode.expiresAt.getTime() - Date.now()) / 1000 / 60);
            return sendError(
                res,
                429,
                'TOO_MANY_REQUESTS',
                `請稍後再試，距離下次可發送還�?${remainingTime} 分鐘`
            );
        }

        // 生成驗證�?
        const code = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 分鐘後過�?

        // 儲存驗證�?
        verificationCodes.set(userId, { code, email, expiresAt });

        // 發送驗證郵�?
        await sendVerificationEmail(email, code);

        // 更新 notification_settings 中的 email（但不設為已驗證�?
        await db
            .update(notificationSettings)
            .set({
                emailAddress: email,
                emailVerified: false,
                updatedAt: new Date(),
            })
            .where(eq(notificationSettings.userId, userId));

        return sendSuccess(res, {
            message: '驗證碼已發送到您的郵箱',
            email,
            expiresIn: 600, // �?
        });
    } catch (error: any) {
        console.error('Send verification email error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '發送驗證碼失敗', error.message);
    }
}

export default requireAuth(handler);

// 導出驗證�?Map 供其�?API 使用
export { verificationCodes };

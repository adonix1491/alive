/**
 * POST /api/notifications/confirm-email
 * 確認 Email 驗證�?API
 */
import { VercelResponse } from '@vercel/node';
import { db } from '../lib/db';
import { notificationSettings } from '../../schema/schema';
import { sendError, sendSuccess, requireAuth, AuthenticatedRequest, enableCORS, handleOptions } from '../lib/middleware';
import { eq } from 'drizzle-orm';
import { verificationCodes } from './verify-email';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    enableCORS(res);

    if (req.method !== 'POST') {
        return sendError(res, 405, 'METHOD_NOT_ALLOWED', '只接�?POST 請求');
    }

    const userId = req.userId!;

    try {
        const { code } = req.body;

        if (!code) {
            return sendError(res, 400, 'MISSING_CODE', '請提供驗證碼');
        }

        // 取得儲存的驗證碼
        const storedData = verificationCodes.get(userId);

        if (!storedData) {
            return sendError(res, 400, 'NO_VERIFICATION_PENDING', '沒有待驗證的郵箱');
        }

        // 檢查是否過期
        if (storedData.expiresAt < new Date()) {
            verificationCodes.delete(userId);
            return sendError(res, 400, 'CODE_EXPIRED', '驗證碼已過期，請重新發�?);
        }

        // 驗證碼比�?
        if (storedData.code !== code.trim()) {
            return sendError(res, 400, 'INVALID_CODE', '驗證碼不正確');
        }

        // 驗證成功，更新資料庫
        const updatedSettings = await db
            .update(notificationSettings)
            .set({
                emailAddress: storedData.email,
                emailVerified: true,
                emailEnabled: true, // 自動啟用 email 通知
                updatedAt: new Date(),
            })
            .where(eq(notificationSettings.userId, userId))
            .returning({
                emailEnabled: notificationSettings.emailEnabled,
                emailAddress: notificationSettings.emailAddress,
                emailVerified: notificationSettings.emailVerified,
            });

        // 刪除已使用的驗證�?
        verificationCodes.delete(userId);

        return sendSuccess(res, {
            message: 'Email 驗證成功',
            settings: updatedSettings[0],
        });
    } catch (error: any) {
        console.error('Confirm email error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '驗證失敗', error.message);
    }
}

export default requireAuth(handler);

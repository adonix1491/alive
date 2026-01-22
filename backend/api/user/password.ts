/**
 * POST /api/user/password
 * 修改密碼 API
 */
import { VercelResponse } from '@vercel/node';
import { db } from '../../lib/db';
import { users } from '../../schema/schema';
import { comparePassword, hashPassword } from '../../lib/auth';
import { sendError, sendSuccess, requireAuth, AuthenticatedRequest, enableCORS, handleOptions } from '../../lib/middleware';
import { eq } from 'drizzle-orm';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    enableCORS(res);

    if (req.method !== 'POST') {
        return sendError(res, 405, 'METHOD_NOT_ALLOWED', '只接受 POST 請求');
    }

    const userId = req.userId!;

    try {
        const { oldPassword, newPassword } = req.body;

        // 驗證必填欄位
        if (!oldPassword || !newPassword) {
            return sendError(res, 400, 'MISSING_FIELDS', '舊密碼和新密碼為必填');
        }

        // 驗證新密碼強度
        if (newPassword.length < 8) {
            return sendError(res, 400, 'WEAK_PASSWORD', '新密碼必須至少 8 個字元');
        }

        // 查詢使用者
        const userResult = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (userResult.length === 0) {
            return sendError(res, 404, 'USER_NOT_FOUND', '使用者不存在');
        }

        const user = userResult[0];

        // 驗證舊密碼
        const isOldPasswordValid = await comparePassword(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return sendError(res, 401, 'INVALID_OLD_PASSWORD', '舊密碼不正確');
        }

        // Hash 新密碼
        const hashedNewPassword = await hashPassword(newPassword);

        // 更新密碼
        await db
            .update(users)
            .set({
                password: hashedNewPassword,
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId));

        return sendSuccess(res, {
            message: '密碼已成功更新',
        });
    } catch (error: any) {
        console.error('Change password error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '修改密碼失敗', error.message);
    }
}

export default requireAuth(handler);

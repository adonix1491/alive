/**
 * GET /api/auth/me
 * 取得當前使用者資訊 API
 */
import { VercelResponse } from '@vercel/node';
import { db } from '../../lib/db';
import { users } from '../../schema/schema';
import { sendError, sendSuccess, requireAuth, AuthenticatedRequest, enableCORS, handleOptions } from '../../lib/middleware';
import { eq } from 'drizzle-orm';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
    // 處理 CORS preflight
    if (handleOptions(req, res)) return;
    enableCORS(res);

    // 只接受 GET 請求
    if (req.method !== 'GET') {
        return sendError(res, 405, 'METHOD_NOT_ALLOWED', '只接受 GET 請求');
    }

    try {
        // userId 由 requireAuth middleware 提供
        const userId = req.userId!;

        // 查詢使用者資料
        const userResult = await db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
                phone: users.phone,
                avatarUrl: users.avatarUrl,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (userResult.length === 0) {
            return sendError(res, 404, 'USER_NOT_FOUND', '使用者不存在');
        }

        const user = userResult[0];

        // 返回使用者資料
        return sendSuccess(res, {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error: any) {
        console.error('Get user info error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '取得使用者資訊失敗', error.message);
    }
}

// 使用 requireAuth middleware 包裝
export default requireAuth(handler);

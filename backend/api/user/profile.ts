/**
 * GET/PUT /api/user/profile
 * 個人資料 API
 */
import { VercelResponse } from '@vercel/node';
import { db } from '../../lib/db';
import { users } from '../../schema/schema';
import { sendError, sendSuccess, requireAuth, AuthenticatedRequest, enableCORS, handleOptions } from '../../lib/middleware';
import { eq } from 'drizzle-orm';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    enableCORS(res);

    const userId = req.userId!;

    try {
        // GET - 取得個人資料
        if (req.method === 'GET') {
            const userResult = await db
                .select({
                    id: users.id,
                    email: users.email,
                    name: users.name,
                    phone: users.phone,
                    avatarUrl: users.avatarUrl,
                })
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            if (userResult.length === 0) {
                return sendError(res, 404, 'USER_NOT_FOUND', '使用者不存在');
            }

            return sendSuccess(res, userResult[0]);
        }

        // PUT - 更新個人資料
        if (req.method === 'PUT') {
            const { name, phone } = req.body;

            // 至少需要一個欄位
            if (!name && !phone) {
                return sendError(res, 400, 'NO_UPDATE_FIELDS', '請提供要更新的欄位');
            }

            // 準備更新資料
            const updateData: any = {
                updatedAt: new Date(),
            };
            if (name) updateData.name = name;
            if (phone !== undefined) updateData.phone = phone || null;

            // 更新使用者
            const updatedUser = await db
                .update(users)
                .set(updateData)
                .where(eq(users.id, userId))
                .returning({
                    id: users.id,
                    email: users.email,
                    name: users.name,
                    phone: users.phone,
                    avatarUrl: users.avatarUrl,
                });

            return sendSuccess(res, updatedUser[0]);
        }

        return sendError(res, 405, 'METHOD_NOT_ALLOWED', '只接受 GET 或 PUT 請求');
    } catch (error: any) {
        console.error('Profile error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '操作失敗', error.message);
    }
}

export default requireAuth(handler);

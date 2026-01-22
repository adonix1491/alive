/**
 * GET /api/checkin/history
 * 查詢簽到歷史 API
 */
import { VercelResponse } from '@vercel/node';
import { db } from '../../lib/db';
import { checkIns } from '../../schema/schema';
import { sendError, sendSuccess, requireAuth, AuthenticatedRequest, enableCORS, handleOptions } from '../../lib/middleware';
import { eq, desc } from 'drizzle-orm';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    enableCORS(res);

    if (req.method !== 'GET') {
        return sendError(res, 405, 'METHOD_NOT_ALLOWED', '只接受 GET 請求');
    }

    const userId = req.userId!;

    try {
        // 取得查詢參數
        const limit = parseInt(req.query.limit as string) || 30;
        const offset = parseInt(req.query.offset as string) || 0;

        // 限制 limit 最大值
        const safeLimit = Math.min(limit, 100);

        // 查詢簽到歷史
        const history = await db
            .select({
                id: checkIns.id,
                timestamp: checkIns.timestamp,
                status: checkIns.status,
                location: checkIns.location,
            })
            .from(checkIns)
            .where(eq(checkIns.userId, userId))
            .orderBy(desc(checkIns.timestamp))
            .limit(safeLimit)
            .offset(offset);

        // 計算總數（可選）
        // 為了效能，這裡只返回當前頁的資料
        // 如果需要總數，可以額外查詢

        return sendSuccess(res, {
            checkIns: history,
            limit: safeLimit,
            offset,
        });
    } catch (error: any) {
        console.error('Check-in history error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '查詢簽到歷史失敗', error.message);
    }
}

export default requireAuth(handler);

/**
 * POST /api/checkin
 * 建立簽到 API
 */
import { VercelResponse } from '@vercel/node';
import { db } from '../lib/db';
import { checkIns } from '../../schema/schema';
import { sendError, sendSuccess, requireAuth, AuthenticatedRequest, enableCORS, handleOptions } from '../lib/middleware';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    enableCORS(res);

    if (req.method !== 'POST') {
        return sendError(res, 405, 'METHOD_NOT_ALLOWED', '只接�?POST 請求');
    }

    const userId = req.userId!;

    try {
        const { location } = req.body;

        // 建立簽到記錄
        const newCheckIn = await db
            .insert(checkIns)
            .values({
                userId,
                timestamp: new Date(),
                status: 'completed',
                location: location || null,
            })
            .returning({
                id: checkIns.id,
                userId: checkIns.userId,
                timestamp: checkIns.timestamp,
                status: checkIns.status,
                location: checkIns.location,
            });

        return sendSuccess(
            res,
            {
                message: '簽到成功',
                checkIn: newCheckIn[0],
            },
            201
        );
    } catch (error: any) {
        console.error('Check-in error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '簽到失敗', error.message);
    }
}

export default requireAuth(handler);

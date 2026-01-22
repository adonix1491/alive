/**
 * GET/PUT /api/notifications/settings
 * 通知設定 API
 */
import { VercelResponse } from '@vercel/node';
import { db } from '../lib/db';
import { notificationSettings } from '../../schema/schema';
import { sendError, sendSuccess, requireAuth, AuthenticatedRequest, enableCORS, handleOptions } from '../lib/middleware';
import { eq } from 'drizzle-orm';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    enableCORS(res);

    const userId = req.userId!;

    try {
        // GET - 取得通知設定
        if (req.method === 'GET') {
            const settings = await db
                .select({
                    emailEnabled: notificationSettings.emailEnabled,
                    emailAddress: notificationSettings.emailAddress,
                    emailVerified: notificationSettings.emailVerified,
                    lineEnabled: notificationSettings.lineEnabled,
                    lineUserId: notificationSettings.lineUserId,
                    lineVerified: notificationSettings.lineVerified,
                    pushEnabled: notificationSettings.pushEnabled,
                })
                .from(notificationSettings)
                .where(eq(notificationSettings.userId, userId))
                .limit(1);

            if (settings.length === 0) {
                // 如果不存在，建立預設設定
                const newSettings = await db
                    .insert(notificationSettings)
                    .values({
                        userId,
                        emailEnabled: false,
                        lineEnabled: false,
                        pushEnabled: true,
                    })
                    .returning({
                        emailEnabled: notificationSettings.emailEnabled,
                        emailAddress: notificationSettings.emailAddress,
                        emailVerified: notificationSettings.emailVerified,
                        lineEnabled: notificationSettings.lineEnabled,
                        lineUserId: notificationSettings.lineUserId,
                        lineVerified: notificationSettings.lineVerified,
                        pushEnabled: notificationSettings.pushEnabled,
                    });

                return sendSuccess(res, newSettings[0]);
            }

            return sendSuccess(res, settings[0]);
        }

        // PUT - 更新通知設定
        if (req.method === 'PUT') {
            const { emailEnabled, emailAddress, lineEnabled, pushEnabled } = req.body;

            // 準備更新資料
            const updateData: any = {
                updatedAt: new Date(),
            };

            if (emailEnabled !== undefined) updateData.emailEnabled = emailEnabled;
            if (emailAddress !== undefined) {
                updateData.emailAddress = emailAddress || null;
                // 如果更改 email，重設驗證狀�?
                if (emailAddress) {
                    updateData.emailVerified = false;
                }
            }
            if (lineEnabled !== undefined) updateData.lineEnabled = lineEnabled;
            if (pushEnabled !== undefined) updateData.pushEnabled = pushEnabled;

            // 更新設定
            const updatedSettings = await db
                .update(notificationSettings)
                .set(updateData)
                .where(eq(notificationSettings.userId, userId))
                .returning({
                    emailEnabled: notificationSettings.emailEnabled,
                    emailAddress: notificationSettings.emailAddress,
                    emailVerified: notificationSettings.emailVerified,
                    lineEnabled: notificationSettings.lineEnabled,
                    lineUserId: notificationSettings.lineUserId,
                    lineVerified: notificationSettings.lineVerified,
                    pushEnabled: notificationSettings.pushEnabled,
                });

            return sendSuccess(res, updatedSettings[0]);
        }

        return sendError(res, 405, 'METHOD_NOT_ALLOWED', '只接�?GET �?PUT 請求');
    } catch (error: any) {
        console.error('Notification settings error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '操作失敗', error.message);
    }
}

export default requireAuth(handler);

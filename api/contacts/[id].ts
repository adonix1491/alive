/**
 * PUT/DELETE /api/contacts/[id]
 * 單一緊急聯絡人操作 API
 */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db';
import { emergencyContacts } from '../../schema/schema';
import { sendError, sendSuccess, requireAuth, AuthenticatedRequest, enableCORS, handleOptions } from '../../lib/middleware';
import { eq, and } from 'drizzle-orm';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    enableCORS(res);

    const userId = req.userId!;
    const contactId = parseInt(req.query.id as string);

    if (isNaN(contactId)) {
        return sendError(res, 400, 'INVALID_ID', '無效的聯絡人 ID');
    }

    try {
        // 檢查聯絡人是否存在且屬於當前使用者
        const existingContact = await db
            .select()
            .from(emergencyContacts)
            .where(
                and(
                    eq(emergencyContacts.id, contactId),
                    eq(emergencyContacts.userId, userId)
                )
            )
            .limit(1);

        if (existingContact.length === 0) {
            return sendError(res, 404, 'CONTACT_NOT_FOUND', '聯絡人不存在或無權訪問');
        }

        // PUT - 更新聯絡人
        if (req.method === 'PUT') {
            const { name, phone, email, relationship, priority, isEnabled } = req.body;

            // 準備更新資料
            const updateData: any = {
                updatedAt: new Date(),
            };
            if (name !== undefined) updateData.name = name;
            if (phone !== undefined) updateData.phone = phone;
            if (email !== undefined) updateData.email = email || null;
            if (relationship !== undefined) updateData.relationship = relationship || null;
            if (priority !== undefined) {
                if (priority < 1) {
                    return sendError(res, 400, 'INVALID_PRIORITY', '優先順序必須大於 0');
                }
                updateData.priority = priority;
            }
            if (isEnabled !== undefined) updateData.isEnabled = isEnabled;

            // 更新聯絡人
            const updatedContact = await db
                .update(emergencyContacts)
                .set(updateData)
                .where(
                    and(
                        eq(emergencyContacts.id, contactId),
                        eq(emergencyContacts.userId, userId)
                    )
                )
                .returning({
                    id: emergencyContacts.id,
                    name: emergencyContacts.name,
                    phone: emergencyContacts.phone,
                    email: emergencyContacts.email,
                    relationship: emergencyContacts.relationship,
                    priority: emergencyContacts.priority,
                    isEnabled: emergencyContacts.isEnabled,
                });

            return sendSuccess(res, updatedContact[0]);
        }

        // DELETE - 刪除聯絡人
        if (req.method === 'DELETE') {
            await db
                .delete(emergencyContacts)
                .where(
                    and(
                        eq(emergencyContacts.id, contactId),
                        eq(emergencyContacts.userId, userId)
                    )
                );

            return sendSuccess(res, {
                message: '聯絡人已刪除',
            });
        }

        return sendError(res, 405, 'METHOD_NOT_ALLOWED', '只接受 PUT 或 DELETE 請求');
    } catch (error: any) {
        console.error('Contact operation error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '操作失敗', error.message);
    }
}

export default requireAuth(handler);

/**
 * GET/POST /api/contacts
 * 緊急聯絡人列表 API
 */
import { VercelResponse } from '@vercel/node';
import { db } from '../../lib/db';
import { emergencyContacts } from '../../schema/schema';
import { sendError, sendSuccess, requireAuth, AuthenticatedRequest, enableCORS, handleOptions } from '../../lib/middleware';
import { eq, and, count } from 'drizzle-orm';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    enableCORS(res);

    const userId = req.userId!;

    try {
        // GET - 取得所有聯絡人
        if (req.method === 'GET') {
            const contacts = await db
                .select({
                    id: emergencyContacts.id,
                    name: emergencyContacts.name,
                    phone: emergencyContacts.phone,
                    email: emergencyContacts.email,
                    relationship: emergencyContacts.relationship,
                    priority: emergencyContacts.priority,
                    isEnabled: emergencyContacts.isEnabled,
                })
                .from(emergencyContacts)
                .where(eq(emergencyContacts.userId, userId))
                .orderBy(emergencyContacts.priority);

            return sendSuccess(res, { contacts });
        }

        // POST - 新增聯絡人
        if (req.method === 'POST') {
            const { name, phone, email, relationship, priority } = req.body;

            // 驗證必填欄位
            if (!name || !phone) {
                return sendError(res, 400, 'MISSING_FIELDS', '姓名和電話為必填');
            }

            // 驗證 priority
            if (priority === undefined || priority < 1) {
                return sendError(res, 400, 'INVALID_PRIORITY', '優先順序必須大於 0');
            }

            // 檢查聯絡人數量限制（最多 5 個）
            const contactCount = await db
                .select({ count: count() })
                .from(emergencyContacts)
                .where(eq(emergencyContacts.userId, userId));

            if (contactCount[0].count >= 5) {
                return sendError(res, 400, 'CONTACT_LIMIT_REACHED', '最多只能新增 5 個緊急聯絡人');
            }

            // 建立聯絡人
            const newContact = await db
                .insert(emergencyContacts)
                .values({
                    userId,
                    name,
                    phone,
                    email: email || null,
                    relationship: relationship || null,
                    priority,
                    isEnabled: true,
                })
                .returning({
                    id: emergencyContacts.id,
                    name: emergencyContacts.name,
                    phone: emergencyContacts.phone,
                    email: emergencyContacts.email,
                    relationship: emergencyContacts.relationship,
                    priority: emergencyContacts.priority,
                    isEnabled: emergencyContacts.isEnabled,
                });

            return sendSuccess(res, newContact[0], 201);
        }

        return sendError(res, 405, 'METHOD_NOT_ALLOWED', '只接受 GET 或 POST 請求');
    } catch (error: any) {
        console.error('Contacts error:', error);
        return sendError(res, 500, 'INTERNAL_ERROR', '操作失敗', error.message);
    }
}

export default requireAuth(handler);

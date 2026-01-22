/**
 * Contacts Routes
 * 處理緊急聯絡人相關的 API
 */

const express = require('express');
const router = express.Router();
const { db } = require('../lib/db');
const { emergencyContacts } = require('../schema');
const { eq, and } = require('drizzle-orm');
const { verifyToken } = require('../lib/auth');

// Middleware
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: { code: 'UNAUTHORIZED', message: '請先登入' }
        });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded.userId !== 'number') {
        return res.status(401).json({
            error: { code: 'UNAUTHORIZED', message: '請先登入' }
        });
    }

    req.userId = decoded.userId;
    next();
}

// GET /api/contacts
router.get('/', requireAuth, async (req, res) => {
    try {
        const contacts = await db.select()
            .from(emergencyContacts)
            .where(eq(emergencyContacts.userId, req.userId));

        res.json({ contacts });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

// POST /api/contacts
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, relationship, phoneNumber, email } = req.body;

        if (!name || !phoneNumber) {
            return res.status(400).json({
                error: { code: 'INVALID_INPUT', message: '姓名和電話為必填' }
            });
        }

        // 檢查聯絡人數量限制
        const existingContacts = await db.select()
            .from(emergencyContacts)
            .where(eq(emergencyContacts.userId, req.userId));

        if (existingContacts.length >= 5) {
            return res.status(400).json({
                error: { code: 'MAX_CONTACTS_REACHED', message: '最多只能新增 5 位緊急聯絡人' }
            });
        }

        const [contact] = await db.insert(emergencyContacts).values({
            userId: req.userId,
            name,
            relationship: relationship || null,
            phoneNumber,
            email: email || null,
        }).returning();

        res.status(201).json({ contact });
    } catch (error) {
        console.error('Create contact error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

// PUT /api/contacts/:id
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const contactId = parseInt(req.params.id);
        const { name, relationship, phoneNumber, email } = req.body;

        if (!name || !phoneNumber) {
            return res.status(400).json({
                error: { code: 'INVALID_INPUT', message: '姓名和電話為必填' }
            });
        }

        // 驗證聯絡人屬於當前用戶
        const [contact] = await db.select()
            .from(emergencyContacts)
            .where(and(
                eq(emergencyContacts.id, contactId),
                eq(emergencyContacts.userId, req.userId)
            ))
            .limit(1);

        if (!contact) {
            return res.status(404).json({
                error: { code: 'CONTACT_NOT_FOUND', message: '聯絡人不存在' }
            });
        }

        const [updatedContact] = await db.update(emergencyContacts).set({
            name,
            relationship: relationship || null,
            phoneNumber,
            email: email || null,
        }).where(eq(emergencyContacts.id, contactId)).returning();

        res.json({ contact: updatedContact });
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

// DELETE /api/contacts/:id
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const contactId = parseInt(req.params.id);

        // 驗證聯絡人屬於當前用戶
        const [contact] = await db.select()
            .from(emergencyContacts)
            .where(and(
                eq(emergencyContacts.id, contactId),
                eq(emergencyContacts.userId, req.userId)
            ))
            .limit(1);

        if (!contact) {
            return res.status(404).json({
                error: { code: 'CONTACT_NOT_FOUND', message: '聯絡人不存在' }
            });
        }

        await db.delete(emergencyContacts).where(eq(emergencyContacts.id, contactId));

        res.json({ message: '聯絡人已刪除' });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' }
        });
    }
});

module.exports = router;

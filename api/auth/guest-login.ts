import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db';
import { users, notificationSettings } from '../../schema/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, generateToken } from '../../lib/auth';

// Enable CORS helper
const allowCors = (fn: any) => async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method Not Allowed' } });
    }

    try {
        console.log('[API] Guest Login Request:', req.body);
        const { phoneNumber, name, email, lineId } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: { code: 'INVALID_INPUT', message: '手機號碼為必填' } });
        }

        // 嘗試尋找現有用戶 (By Phone)
        const existingUsers = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber)).limit(1);
        let user = existingUsers[0];

        if (!user) {
            // Check if email provided is already taken (if provided)
            let guestEmail = `guest_${phoneNumber}@alive.app`;
            if (email) {
                const emailCheck = await db.select().from(users).where(eq(users.email, email)).limit(1);
                if (emailCheck.length > 0) {
                    return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: '此 Email 已被註冊' } });
                }
                guestEmail = email;
            } else {
                // Check if generated guest email collision
                const emailCheck = await db.select().from(users).where(eq(users.email, guestEmail)).limit(1);
                if (emailCheck.length > 0) {
                    user = emailCheck[0];
                }
            }

            if (!user) {
                const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const hashedPassword = await hashPassword(randomPassword);
                const userName = name || `Guest ${phoneNumber.slice(-4)}`;

                const [newUser] = await db.insert(users).values({
                    name: userName,
                    email: guestEmail,
                    password: hashedPassword,
                    phoneNumber: phoneNumber,
                    lineId: lineId || null,
                }).returning();
                user = newUser;

                await db.insert(notificationSettings).values({
                    userId: user.id,
                    emailEnabled: false,
                    lineEnabled: false,
                });
            }
        } else {
            // Update existing user
            const updates: any = {};
            if (name && name !== user.name) updates.name = name;
            if (lineId && lineId !== user.lineId) updates.lineId = lineId;
            // Note: Email update skipped as per unsafe

            if (Object.keys(updates).length > 0) {
                const [updated] = await db.update(users).set({
                    ...updates,
                    updatedAt: new Date(),
                }).where(eq(users.id, user.id)).returning();
                user = updated;
            }
        }

        const token = generateToken(user.id);

        return res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, lineId: user.lineId },
        });

    } catch (error) {
        console.error('Guest login error:', error);
        return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } });
    }
}

export default allowCors(handler);

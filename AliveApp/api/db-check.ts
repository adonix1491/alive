// @ts-nocheck
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './lib/db';
import { users } from './schema/db_schema';
import { sql } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        console.log('Attempting DB connection...');

        // 測試 1: 簡單的 SELECT 1
        const now = await db.execute(sql`SELECT NOW()`);

        // 測試 2: 查詢 Users 表數量
        const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);

        res.status(200).json({
            status: 'ok',
            message: 'Database connection successful',
            timestamp: now.rows[0],
            userCount: userCount[0]?.count,
            env: {
                hasPostgresUrl: !!process.env.POSTGRES_URL,
                nodeEnv: process.env.NODE_ENV
            }
        });
    } catch (error: any) {
        console.error('DB Check Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message,
            stack: error.stack,
            env: {
                hasPostgresUrl: !!process.env.POSTGRES_URL
            }
        });
    }
}

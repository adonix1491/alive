
import { db } from '../lib/db';
import { users } from '../schema/schema';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function testConnection() {
    try {
        console.log('Testing Database Connection...');
        const result = await db.execute(sql`SELECT NOW()`);
        console.log('Connection Successful!', result.rows[0]);

        const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
        console.log('User count:', userCount[0].count);

        process.exit(0);
    } catch (error) {
        console.error('Connection Failed:', error);
        process.exit(1);
    }
}

testConnection();

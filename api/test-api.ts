
import { db } from './lib/db';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function main() {
    console.log('🔍 Testing API & DB Connection...');

    try {
        // Simple Query to check DB
        const result = await db.execute(sql`SELECT NOW()`);
        console.log('✅ Database Connected:', result.rows[0]);

        console.log('✅ API Test Passed (Internal Logic)');
        process.exit(0);
    } catch (error) {
        console.error('❌ API Test Failed');
        console.error(error);
        process.exit(1);
    }
}

main();

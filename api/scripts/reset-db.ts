
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function main() {
    console.log('🔥 Resetting Database...');

    try {
        await db.execute(sql`DROP TABLE IF EXISTS "check_ins" CASCADE;`);
        await db.execute(sql`DROP TABLE IF EXISTS "emergency_contacts" CASCADE;`);
        await db.execute(sql`DROP TABLE IF EXISTS "message_templates" CASCADE;`);
        await db.execute(sql`DROP TABLE IF EXISTS "notification_settings" CASCADE;`);
        await db.execute(sql`DROP TABLE IF EXISTS "users" CASCADE;`);
        console.log('✅ Tables Dropped.');
    } catch (e: any) {
        console.error('⚠️ Error dropping tables:', e.message);
    }

    console.log('🔄 Re-applying Migration...');
    // We can reuse the logic from apply-migration, or just import it if it exported a function, 
    // but for simplicity, I'll just run the same SQL file read logic here or run the other script via child_process.
    // I will execute the SQL file content directly here.

    const fs = require('fs');
    const migrationDir = path.resolve(__dirname, '../../drizzle');
    const file = '0000_bent_lord_tyger.sql';

    const content = fs.readFileSync(path.join(migrationDir, file), 'utf-8');
    const statements = content.split('--> statement-breakpoint').filter((s: string) => s.trim().length > 0);

    for (const statement of statements) {
        try {
            await db.execute(sql.raw(statement));
        } catch (e: any) {
            console.warn(`⚠️ Error executing statement: ${e.message}`);
        }
    }

    console.log('✅ Database Reset Complete.');
    process.exit(0);
}

main();

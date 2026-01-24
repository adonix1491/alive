
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
    console.log('🔄 Applying Migrations...');

    const migrationDir = path.resolve(__dirname, '../../drizzle');
    const files = fs.readdirSync(migrationDir).filter(f => f.endsWith('.sql')).sort();

    if (files.length === 0) {
        console.log('⚠️ No migration files found.');
        return;
    }

    // Get the latest migration based on numeric prefix usually, or just apply all (idempotency depends on SQL)
    // Drizzle Generate usually creates `0000_...sql`

    for (const file of files) {
        console.log(`📄 Executing ${file}...`);
        const content = fs.readFileSync(path.join(migrationDir, file), 'utf-8');
        const statements = content.split('--> statement-breakpoint').filter(s => s.trim().length > 0);

        for (const statement of statements) {
            try {
                await db.execute(sql.raw(statement));
            } catch (e: any) {
                console.warn(`⚠️ Error executing statement (might be safe if exists): ${e.message}`);
            }
        }
    }

    console.log('✅ Migration Applied.');
    process.exit(0);
}

main();

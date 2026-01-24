
import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });

async function main() {
    console.log('🔧 Starting DB Fix Migration...');
    try {
        // Fix Users Table
        console.log('Adding phone_number to users table...');
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;`;

        // Also check if avatar_url is missing (schema has it)
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;`;

        console.log('✅ Migration applied successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Failed!');
        console.error(error);
        process.exit(1);
    }
}

main();

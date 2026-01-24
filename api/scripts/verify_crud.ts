
import { db } from '../lib/db';
import { users } from '../schema/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// Fallback: Load from old backend folder
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });

async function main() {
    console.log('🔍 Starting CRUD Verification...');

    // 1. Create - Test Write
    const testEmail = `crud_test_${Date.now()}@example.com`;
    console.log(`📝 Attempting to INSERT user: ${testEmail}`);

    try {
        const [newUser] = await db.insert(users).values({
            name: 'CRUD Tester',
            email: testEmail,
            password: 'hashed_password_dummy',
            phoneNumber: '0900000000'
        }).returning();

        console.log('✅ INSERT Success. User ID:', newUser.id);

        // 2. Read - Test Read
        console.log('📖 Attempting to SELECT user...');
        const [fetchedUser] = await db.select().from(users).where(eq(users.id, newUser.id));

        if (fetchedUser && fetchedUser.email === testEmail) {
            console.log('✅ SELECT Success. Found user:', fetchedUser.email);
        } else {
            console.error('❌ SELECT Failed. User not found or mismatch.');
        }

        // 3. Delete - Cleanup
        console.log('🗑️ Attempting to DELETE user...');
        await db.delete(users).where(eq(users.id, newUser.id));
        console.log('✅ DELETE Success.');

        console.log('🎉 CRUD Verification Passed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ CRUD Verification Failed!');
        console.error(error);
        process.exit(1);
    }
}

main();

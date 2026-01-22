import 'dotenv/config';
import { db } from './lib/db.js';
import { users } from './schema/schema.js';

async function testConnection() {
    try {
        console.log('🔍 測試資料庫連接...');

        // 查詢使用者表
        const result = await db.select().from(users);
        console.log('✅ 資料庫連接成功！');
        console.log(`📊 目前使用者數量: ${result.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ 資料庫連接失敗:', error);
        process.exit(1);
    }
}

testConnection();

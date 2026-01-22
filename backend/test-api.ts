/**
 * API 測試腳本
 * 測試認證 API 的基本功能
 */
import 'dotenv/config';

const API_BASE = 'http://localhost:3000/api';

// 測試資料
const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'testpassword123',
    name: '測試用戶',
    phone: '0912345678',
};

let authToken: string;

async function testRegister() {
    console.log('\n🧪 測試註冊 API...');

    const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
    });

    const data = await response.json();

    if (response.ok) {
        console.log('✅ 註冊成功');
        console.log('   Token:', data.token.substring(0, 20) + '...');
        console.log('   User:', data.user.name, `(${data.user.email})`);
        authToken = data.token;
        return true;
    } else {
        console.log('❌ 註冊失敗:', data.error.message);
        return false;
    }
}

async function testLogin() {
    console.log('\n🧪 測試登入 API...');

    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: testUser.email,
            password: testUser.password,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        console.log('✅ 登入成功');
        console.log('   Token:', data.token.substring(0, 20) + '...');
        console.log('   User:', data.user.name);
        return true;
    } else {
        console.log('❌ 登入失敗:', data.error.message);
        return false;
    }
}

async function testGetMe() {
    console.log('\n🧪 測試取得使用者資訊 API...');

    const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
    });

    const data = await response.json();

    if (response.ok) {
        console.log('✅ 取得使用者資訊成功');
        console.log('   ID:', data.id);
        console.log('   姓名:', data.name);
        console.log('   Email:', data.email);
        console.log('   電話:', data.phone || '未設定');
        return true;
    } else {
        console.log('❌ 取得使用者資訊失敗:', data.error?.message || 'Unknown error');
        return false;
    }
}

async function testInvalidToken() {
    console.log('\n🧪 測試無效 Token...');

    const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer invalid-token',
        },
    });

    const data = await response.json();

    if (response.status === 401) {
        console.log('✅ 正確拒絕無效 Token');
        return true;
    } else {
        console.log('❌ 應該拒絕無效 Token');
        return false;
    }
}

async function runTests() {
    console.log('🚀 開始測試認證 API\n');
    console.log('📍 API Base:', API_BASE);

    try {
        // 測試註冊
        const registerSuccess = await testRegister();
        if (!registerSuccess) {
            console.log('\n❌ 測試中止：註冊失敗');
            return;
        }

        // 等待一下
        await new Promise(resolve => setTimeout(resolve, 500));

        // 測試登入
        const loginSuccess = await testLogin();
        if (!loginSuccess) {
            console.log('\n❌ 測試中止：登入失敗');
            return;
        }

        // 等待一下
        await new Promise(resolve => setTimeout(resolve, 500));

        // 測試取得使用者資訊
        await testGetMe();

        // 測試無效 Token
        await testInvalidToken();

        console.log('\n✅ 所有測試完成！');

    } catch (error: any) {
        console.error('\n❌ 測試過程發生錯誤:', error.message);
        console.error('\n提示：請確保 Vercel Dev 伺服器正在運行');
        console.error('執行：cd backend && npm run dev');
    }
}

runTests();

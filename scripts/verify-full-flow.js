const fetch = require('node-fetch'); // Assuming node-fetch is available or using built-in in Node 18+

const API_BASE = 'https://alive-iota.vercel.app/api';

async function verifyFix() {
    console.log('🔍 Starting Deep Verification on:', API_BASE);
    const timestamp = Date.now();
    const email = `verify_${timestamp}@example.com`;
    const password = 'password123';
    const name = `VerifyBot_${timestamp}`;

    try {
        // 1. Register
        console.log(`\n1. Registering ${email}...`);
        const regRes = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        });
        const regData = await regRes.json();

        if (!regRes.ok) throw new Error(`Register failed: ${JSON.stringify(regData)}`);
        console.log('   ✅ Register success. User ID:', regData.user.id);

        // CHECK: Does response have lineId field?
        if (regData.user.hasOwnProperty('lineId')) {
            console.log('   ✅ Register response contains "lineId" field (Value:', regData.user.lineId, ')');
        } else {
            console.error('   ❌ Register response MISSING "lineId" field!');
        }

        const token = regData.token;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 2. Update Profile with Line ID
        console.log(`\n2. Updating Profile with Line ID...`);
        const lineId = `LINE_${timestamp}`;
        const upRes = await fetch(`${API_BASE}/user/profile`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ name, lineId })
        });
        const upData = await upRes.json();
        console.log('   Update status:', upRes.status);

        // 3. GET /auth/me to verify persistence and return structure
        console.log(`\n3. Verifying /auth/me (CRITICAL STEP)...`);
        const meRes = await fetch(`${API_BASE}/auth/me`, { headers });
        const meData = await meRes.json();

        console.log('   /auth/me Response User:', meData.user);

        if (meData.user && meData.user.lineId === lineId) {
            console.log('   ✅ CRITICAL PASS: /auth/me returned correct lineId.');
        } else {
            console.error('   ❌ CRITICAL FAIL: /auth/me did NOT return correct lineId. Got:', meData.user?.lineId);
            console.log('   Possible cause: API backend code not updated yet (Vercel deployment delay) or fix incorrect.');
            // Don't stop, try check-in anyway
        }

        // 4. Check-in
        console.log(`\n4. Attempting Check-in...`);
        const checkRes = await fetch(`${API_BASE}/checkin`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ latitude: 121.5, longitude: 25.0, note: 'Verification Checkin' })
        });
        const checkData = await checkRes.json();

        if (checkRes.status === 201) {
            console.log('   ✅ Check-in Success:', checkData);
        } else {
            console.error('   ❌ Check-in Failed:', checkRes.status, checkData);
        }

        // 5. Message Templates
        console.log(`\n5. Testing Message Templates...`);
        const msgRes = await fetch(`${API_BASE}/message-templates`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ type: 'custom', content: 'Verification Message Content' })
        });
        const msgData = await msgRes.json();

        if (msgRes.status === 200) {
            console.log('   ✅ Message Template Saved:', msgData);
        } else {
            console.error('   ❌ Message Template Save Failed:', msgRes.status, msgData);
        }

    } catch (err) {
        console.error('🚨 Verification Script Error:', err);
    }
}

verifyFix();

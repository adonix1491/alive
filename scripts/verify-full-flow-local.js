const fetch = require('node-fetch');

// Local Dev Server
const API_BASE = 'http://localhost:3000/api';

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
        const token = regData.token;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 2. Auth Me
        console.log(`\n2. Verifying /auth/me...`);
        const meRes = await fetch(`${API_BASE}/auth/me`, { headers });
        const meData = await meRes.json();
        console.log('   /auth/me Response User:', meData.user.name);

        if (meData.user && meData.user.email === email) {
            console.log('   ✅ /auth/me verified.');
        } else {
            console.error('   ❌ /auth/me failed.');
        }

        // 3. Check-in
        console.log(`\n3. Attempting Check-in...`);
        const checkRes = await fetch(`${API_BASE}/checkin`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ latitude: '121.5', longitude: '25.0', note: 'Verification Checkin' })
        });
        const checkData = await checkRes.json();

        if (checkRes.status === 201) {
            console.log('   ✅ Check-in Success:', checkData);
        } else {
            console.error('   ❌ Check-in Failed:', checkRes.status, checkData);
        }

        // 4. Message Templates
        console.log(`\n4. Testing Message Templates...`);
        const msgRes = await fetch(`${API_BASE}/message-templates`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ type: 'custom', content: 'Verification Message Content' })
        });
        const msgData = await msgRes.json();

        if (msgRes.status === 201) {
            console.log('   ✅ Message Template Saved:', msgData.template.id);
        } else {
            console.error('   ❌ Message Template Save Failed:', msgRes.status, msgData);
        }

        console.log('\n✨ Full Flow Verification Complete!');

    } catch (err) {
        console.error('🚨 Verification Script Error:', err);
    }
}

verifyFix();

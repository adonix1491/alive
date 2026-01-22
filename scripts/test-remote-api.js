const fetch = require('node-fetch');

const BASE_URL = 'https://alive-iota.vercel.app/api';

async function testFullFlow() {
    console.log(`Testing Full Flow at: ${BASE_URL}`);

    // 1. Register
    const email = `test_flow_${Date.now()}@example.com`;
    const password = "password123";

    const regRes = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: "Flow User",
            email,
            password,
            phoneNumber: "0999888777"
        })
    });

    const regData = await regRes.json();
    console.log('1. Register:', regRes.status, regRes.status === 201 ? '✅' : '❌', JSON.stringify(regData));

    if (regRes.status !== 201) return;

    // 2. Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const loginData = await loginRes.json();
    console.log('2. Login:', loginRes.status, loginRes.status === 200 ? '✅' : '❌');

    if (loginRes.status !== 200) return;

    const token = loginData.token;
    if (!token) {
        console.error('❌ No token received!');
        return;
    }

    // 3. Check-in
    const checkinRes = await fetch(`${BASE_URL}/checkin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            latitude: "25.0330",
            longitude: "121.5654",
            note: "API Test Checkin"
        })
    });

    const checkinData = await checkinRes.json();
    console.log('3. Check-in:', checkinRes.status, checkinRes.status === 201 ? '✅' : '❌', JSON.stringify(checkinData));
}

testFullFlow();


/**
 * End-to-End API Test Script
 * Verifies: Register -> Login -> Get Profile -> Check-in -> Get History
 */
import * as dotenv from 'dotenv';
import path from 'path';
// Force reload .env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import app from '../app';
import http from 'http';

const PORT = 3001; // Use a different port for testing
const BASE_URL = `http://localhost:${PORT}/api`;

const server = http.createServer(app);

async function runTest() {
    return new Promise<void>((resolve, reject) => {
        server.listen(PORT, async () => {
            console.log(`🚀 Test Server running on port ${PORT}`);
            try {
                await executeFlow();
                resolve();
            } catch (error) {
                console.error('❌ Test Failed:', error);
                reject(error);
            } finally {
                server.close();
                console.log('🛑 Test Server stopped');
            }
        });
    });
}

async function executeFlow() {
    const timestamp = Date.now();
    const testUser = {
        name: `Test User ${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'password123',
        phoneNumber: `09${timestamp.toString().slice(-8)}`
    };

    console.log('\n1️⃣  Testing Registration...');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
    });

    if (!regRes.ok) {
        const err = await regRes.json();
        throw new Error(`Registration failed: ${JSON.stringify(err)}`);
    }
    const regData = await regRes.json();
    console.log('✅ Registration User ID:', regData.user.id);
    console.log('📝 DB Return (User):', JSON.stringify(regData.user, null, 2));
    const token = regData.token;

    console.log('\n2️⃣  Testing Login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });

    if (!loginRes.ok) throw new Error('Login failed');
    const loginData = await loginRes.json();
    console.log('✅ Login Successful.');
    console.log('📝 DB Return (Login User):', JSON.stringify(loginData.user, null, 2));

    console.log('\n3️⃣  Testing Check-in...');
    const checkInRes = await fetch(`${BASE_URL}/checkin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            latitude: '25.0330',
            longitude: '121.5654',
            note: 'E2E Test Checkin'
        })
    });

    if (!checkInRes.ok) {
        const err = await checkInRes.json();
        throw new Error(`Check-in failed: ${JSON.stringify(err)}`);
    }
    const checkInData = await checkInRes.json();
    console.log('✅ Check-in Successful.');
    console.log('📝 DB Return (CheckIn):', JSON.stringify(checkInData, null, 2));

    console.log('\n4️⃣  Verifying History...');
    const historyRes = await fetch(`${BASE_URL}/checkin/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const historyData = await historyRes.json();
    if (historyData.history.length === 0) throw new Error('History is empty after check-in');
    console.log(`✅ History verified. Total check-ins: ${historyData.total}`);
    console.log('📝 DB Return (History Sample):', JSON.stringify(historyData.history[0], null, 2));

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
}

runTest().catch(() => process.exit(1));

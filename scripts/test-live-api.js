const fetch = require('node-fetch'); // You might need to install this or use built-in fetch if node version > 18
// If node < 18, we might need to rely on the user having it or just use https module. 
// Let's assuming standard fetch is available in the user's node environment (Node 20+ from package.json engines).

const API_BASE = 'https://alive-iota.vercel.app/api';

async function testLiveApi() {
    console.log('Testing Live API:', API_BASE);

    // 1. Login (or Register if needed, but let's try login with a known test user if possible, or create one)
    // Let's create a random user to ensure fresh state
    const randomSuffix = Math.floor(Math.random() * 10000);
    const email = `testuser${randomSuffix}@example.com`;
    const password = 'password123';
    const name = `TestUser${randomSuffix}`;

    console.log(`\n1. Registering user: ${email}...`);
    let authData;

    try {
        const regRes = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, phoneNumber: '' }) // No phone initially
        });

        const regJson = await regRes.json();
        if (regRes.ok) {
            console.log('   Register Success:', regJson.user.id);
            authData = regJson;
        } else {
            console.log('   Register Failed:', regJson);
            // Try login if user exists (unlikely with random)
            return;
        }
    } catch (e) {
        console.error('   Register Network Error:', e.message);
        return;
    }

    const token = authData.token;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // 2. Check Profile (Should be clean)
    console.log('\n2. Checking Profile...');
    const prodRes = await fetch(`${API_BASE}/user/profile`, { headers });
    const profJson = await prodRes.json();
    console.log('   Profile:', profJson);

    // 3. Try Check-in (Should FAIL - Profile Incomplete)
    console.log('\n3. Testing Check-in (Expect Fail - Incomplete)...');
    const checkinRes1 = await fetch(`${API_BASE}/checkin`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ latitude: 0, longitude: 0 })
    });
    const checkinJson1 = await checkinRes1.json();
    console.log(`   Status: ${checkinRes1.status} (Exp: 403)`);
    console.log('   Response:', checkinJson1);

    // 4. Update Profile (Add Line ID)
    console.log('\n4. Updating Profile (Add Line ID)...');
    const updateRes = await fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name, lineId: 'test_line_id' })
    });
    const updateJson = await updateRes.json();
    console.log('   Update Result:', updateJson);

    // 5. Try Check-in (Should SUCCESS)
    console.log('\n5. Testing Check-in (Expect Success)...');
    const checkinRes2 = await fetch(`${API_BASE}/checkin`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ latitude: 0, longitude: 0 })
    });
    const checkinJson2 = await checkinRes2.json();
    console.log(`   Status: ${checkinRes2.status} (Exp: 201)`);
    console.log('   Response:', checkinJson2);

    // 6. Test Message Templates
    console.log('\n6. Testing Message Templates...');
    // Save Custom
    console.log('   Saving Custom Template...');
    const saveMsgRes = await fetch(`${API_BASE}/message-templates`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ type: 'custom', content: 'Help me!' })
    });
    console.log(`   Save Status: ${saveMsgRes.status}`);
    console.log('   Save Response:', await saveMsgRes.json());

    // Get Templates
    console.log('   Getting Templates...');
    const getMsgRes = await fetch(`${API_BASE}/message-templates`, { headers });
    const getMsgJson = await getMsgRes.json();
    console.log('   Templates:', getMsgJson);
}

testLiveApi();

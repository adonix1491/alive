const fetch = require('node-fetch');

// Point to Local Dev Server
const BASE_URL = 'http://localhost:3000/api';

async function testGuestWorkflow() {
    console.log(`🚀 Testing Guest CRUD Workflow at: ${BASE_URL}\n`);

    // 1. Guest Login (Implicit Account)
    const phone = `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
    console.log(`📱 Attempting Guest Login with phone: ${phone}`);

    try {
        const loginRes = await fetch(`${BASE_URL}/auth/guest-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber: phone,
                name: "Local Test Guest"
            })
        });

        const loginData = await loginRes.json();
        if (loginRes.status !== 200) {
            console.error('❌ Login Failed:', loginData);
            return;
        }
        console.log('✅ Guest Login Success. Token received.');
        const token = loginData.token;

        // 2. Create Message Template (CRUD Test)
        console.log('\n📝 Creating Custom Message Template...');
        const templateTitle = `Test Template ${Date.now()}`;
        const createRes = await fetch(`${BASE_URL}/message-templates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                type: 'custom',
                title: templateTitle,
                content: "Local connection verification!"
            })
        });

        const createData = await createRes.json();
        if (createRes.status !== 201) {
            console.error('❌ Create Template Failed:', createData);
        } else {
            console.log('✅ Template Created:', createData.template.id, createData.template.title);
        }

        // 3. Verify Persistence (List Templates)
        console.log('\n🔍 Verifying Persistence (List Templates)...');
        const listRes = await fetch(`${BASE_URL}/message-templates`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const listData = await listRes.json();
        if (listRes.status !== 200) {
            console.error('❌ List Templates Failed:', listData);
            return;
        }

        const found = listData.templates.find(t => t.title === templateTitle);
        if (found) {
            console.log(`🎉 SUCCESS! Found template "${found.title}" (ID: ${found.id}) in database.`);
        } else {
            console.error('❌ FAILURE! Created template was NOT found in list response.');
            console.log('Received list:', JSON.stringify(listData.templates.map(t => t.title)));
        }

    } catch (e) {
        console.error('❌ Connection Failed. Is the server running?');
        console.error(e);
    }
}

testGuestWorkflow();

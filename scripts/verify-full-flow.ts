
/**
 * Verification Script: Full User Flow
 * 
 * Scenarios:
 * 1. Guest Login (Register/Login)
 * 2. Get Profile (Verify persistence)
 * 3. Check-In (Verify core feature)
 * 4. Get History (Verify data retrieval)
 * 5. Add Contact (Verify sub-resource creation)
 * 6. Get Contacts (Verify sub-resource retrieval)
 */

const BASE_URL = 'http://localhost:3000';

async function runStep(name: string, fn: () => Promise<any>) {
    console.log(`\n⏳ [Step] ${name}...`);
    try {
        const result = await fn();
        console.log(`✅ [Pass] ${name}`);
        return result;
    } catch (error: any) {
        console.error(`❌ [Fail] ${name}`);
        console.error('Error details:', error.message || error);
        if (error.response) {
            const text = await error.response.text();
            console.error('Response body:', text);
        }
        process.exit(1);
    }
}

async function main() {
    console.log('🚀 Starting System Verification...');

    // Randomize user to ensure fresh run
    const randomSuffix = Math.floor(Math.random() * 10000);
    const phoneNumber = `090000${randomSuffix}`;
    const userName = `TestUser_${randomSuffix}`;

    let token = '';
    let userId = 0;

    // 1. Guest Login
    await runStep('Guest Login', async () => {
        const res = await fetch(`${BASE_URL}/api/auth/guest-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber,
                name: userName
            })
        });

        if (!res.ok) throw new Error(`Login failed: ${res.status}`);
        const data = await res.json();

        if (!data.token || !data.user) throw new Error('No token or user returned');

        token = data.token;
        userId = data.user.id;
        console.log(`   -> Logged in as User ID: ${userId}`);
    });

    const authHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // 2. Get Profile
    await runStep('Get Profile', async () => {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: authHeaders
        });

        if (!res.ok) throw new Error(`Get Profile failed: ${res.status}`);
        const data = await res.json();
        if (data.user.id !== userId) throw new Error('User ID mismatch');
    });

    // 3. Check-In
    await runStep('Perform Check-In', async () => {
        const res = await fetch(`${BASE_URL}/api/checkin`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                latitude: 25.0330,
                longitude: 121.5654,
                note: 'Automated Test Check-in'
            })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Check-in failed: ${res.status} - ${err}`);
        }
        const data = await res.json();
        if (!data.checkIn) throw new Error('No checkIn object returned');
    });

    // 4. Get History
    await runStep('Get Check-In History', async () => {
        const res = await fetch(`${BASE_URL}/api/checkin/history`, {
            headers: authHeaders
        });

        if (!res.ok) throw new Error(`Get History failed: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data.history) || data.history.length === 0) {
            throw new Error('History is empty or invalid');
        }
        const latest = data.history[0];
        if (latest.note !== 'Automated Test Check-in') {
            throw new Error('Latest check-in content mismatch');
        }
    });

    // 5. Add Contact
    await runStep('Add Emergency Contact', async () => {
        const res = await fetch(`${BASE_URL}/api/contacts`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'Mom',
                phoneNumber: '0987654321',
                relationship: 'Parent'
            })
        });

        if (!res.ok) throw new Error(`Add Contact failed: ${res.status}`);
        const data = await res.json();
        if (!data.contact) throw new Error('No contact returned');
    });

    // 6. Get Contacts
    await runStep('Get Contacts List', async () => {
        const res = await fetch(`${BASE_URL}/api/contacts`, {
            headers: authHeaders
        });

        if (!res.ok) throw new Error(`Get Contacts failed: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data.contacts) || data.contacts.length === 0) {
            throw new Error('Contacts list is empty');
        }
        const contact = data.contacts[0];
        if (contact.name !== 'Mom') throw new Error('Contact name mismatch');
    });

    console.log('\n✨ All Systems Go! The API is fully functional for standard flows.');
}

main().catch(console.error);

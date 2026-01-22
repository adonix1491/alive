const fetch = require('node-fetch');

// The browser requests this exact URL based on index.html: <script src="/bundle.web.js">
const BUNDLE_URL = 'https://alive-iota.vercel.app/bundle.web.js';

async function checkFrontend() {
    console.log(`🔍 Checking Frontend Asset: ${BUNDLE_URL}`);

    try {
        const jsRes = await fetch(BUNDLE_URL);

        if (!jsRes.ok) {
            throw new Error(`Failed to fetch JS bundle: ${jsRes.status} ${jsRes.statusText}`);
        }

        const jsContent = await jsRes.text();
        console.log(`\n📦 Bundle size: ${jsContent.length} bytes`);

        // Heuristic: If size is small (< 5KB), it's likely HTML error page, not the JS bundle.
        if (jsContent.length < 5000) {
            console.log('   ⚠️ WARNING: Bundle size is suspiciously small. Likely returning HTML (SPA Fallback).');
            if (jsContent.includes('<!doctype html>')) {
                console.log('   🚨 CONFIRMED: Server returned HTML instead of JS.');
                console.log('   Main Cause: vercel.json rewrite rules might be catching /bundle.web.js');
            }
        }

        // Check for specific strings we added recently
        const checks = [
            { term: '訪客模式', desc: 'Guest Mode Alert' },
            { term: 'MessageTemplates', desc: 'Navigation Fix' },
            { term: 'lineId', desc: 'LineID support' },
            { term: 'AliveApp/dist', desc: 'Build Path Reference (optional)' }
        ];

        console.log('\n🧪 Testing Content:');
        let allPassed = true;
        for (const check of checks) {
            // Check for raw string or unicode escape sequence often found in webpack bundles
            const term = check.term;
            // Simple check
            const found = jsContent.includes(term);

            if (found) {
                console.log(`   ✅ FOUND: "${check.desc}"`);
            } else {
                console.log(`   ❌ MISSING: "${check.desc}"`);
                allPassed = false;
            }
        }

        if (allPassed) {
            console.log('\n🎉 SUCCESS: The deployed frontend matches the latest code.');
        } else {
            console.log('\n⚠️ FAILURE: The deployed frontend is missing key changes.');
        }

    } catch (err) {
        console.error('🚨 Error verifying frontend:', err);
    }
}

checkFrontend();

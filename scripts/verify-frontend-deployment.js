const fetch = require('node-fetch');

// The browser requests this exact URL based on index.html
const BASE_URL = 'https://alive-iota.vercel.app';

async function checkFrontend() {
    console.log(`🔍 Checking Frontend at: ${BASE_URL}`);

    try {
        // 1. Fetch index.html first to find the bundle URL
        const htmlRes = await fetch(BASE_URL);
        if (!htmlRes.ok) throw new Error(`Failed to fetch index.html: ${htmlRes.status}`);

        const htmlContent = await htmlRes.text();

        // Look for <script ... src="/bundle.web.[hash].js">
        const scriptMatch = htmlContent.match(/src="([^"]*bundle\.web\.[^"]+\.js)"/);

        if (!scriptMatch) {
            console.error('❌ Could not find bundle.web.*.js script tag in index.html!');
            console.log('HTML content preview:', htmlContent.substring(0, 500));
            return;
        }

        const bundlePath = scriptMatch[1];
        const bundleUrl = bundlePath.startsWith('http') ? bundlePath : `${BASE_URL}${bundlePath}`;

        console.log(`\n🎯 Found bundle: ${bundleUrl}`);

        // 2. Fetch the actual JS bundle
        const jsRes = await fetch(bundleUrl);

        if (!jsRes.ok) {
            throw new Error(`Failed to fetch JS bundle: ${jsRes.status} ${jsRes.statusText}`);
        }

        const jsContent = await jsRes.text();
        console.log(`\n📦 Bundle size: ${jsContent.length} bytes`);

        // Heuristic: If size is small (< 5KB), it's likely HTML error page, not the JS bundle.
        if (jsContent.length < 5000) {
            console.log('   ⚠️ WARNING: Bundle size is suspiciously small. Likely returning HTML (SPA Fallback).');
        }

        // Check for specific strings we added recently
        const checks = [
            { term: '訪客模式', desc: 'Guest Mode Alert' },
            { term: 'MessageTemplates', desc: 'Navigation Fix' },
            { term: 'lineId', desc: 'LineID support' },
            { term: '訪客快速簽到', desc: 'Guest Login UI' },
            { term: '啟用訪客模式', desc: 'Enable Guest Button' },
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

        // Check for version stamp in index.html (Simulated by checking bundle URL if we were fetching index.html, but here we just check bundle content)
        // Since we fetch bundle directly, we can't check the script tag in index.html easily with this script structure.
        // Let's just trust the content check for now.

    } catch (err) {
        console.error('🚨 Error verifying frontend:', err);
    }
}

checkFrontend();

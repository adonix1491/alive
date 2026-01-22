const fetch = require('node-fetch');

const TARGET_URL = 'https://alive-iota.vercel.app/AliveApp/dist/bundle.web.js';
// Also try root if rewrites are working efficiently, but let's check the direct asset path if possible or where index.html points.
// Actually, let's first check index.html to see what it loads.
const SITE_URL = 'https://alive-iota.vercel.app/';

async function checkFrontend() {
    console.log('🔍 Checking Live Frontend Assets...');

    try {
        // 1. Get HTML to find script src
        const htmlRes = await fetch(SITE_URL);
        const html = await htmlRes.text();
        console.log(`\n📄 HTML fetched (${html.length} bytes).`);

        // Match script src
        // Looking for <script src="...">
        const scriptMatch = html.match(/<script\s+src=["']([^"']+)["']/);
        let scriptPath = '';
        if (scriptMatch) {
            scriptPath = scriptMatch[1];
            console.log(`   Found script target: ${scriptPath}`);
        } else {
            console.log('   waning: No <script> tag found in HTML. Trying default bundle path.');
            scriptPath = '/AliveApp/dist/bundle.web.js'; // Default guess based on rewrites
        }

        // Construct full script URL
        // If relative, append to SITE_URL
        let scriptUrl = scriptPath;
        if (!scriptPath.startsWith('http')) {
            if (scriptPath.startsWith('/')) {
                scriptUrl = 'https://alive-iota.vercel.app' + scriptPath;
            } else {
                scriptUrl = 'https://alive-iota.vercel.app/' + scriptPath;
            }
        }

        console.log(`\n📥 Downloading Bundle from: ${scriptUrl}`);
        const jsRes = await fetch(scriptUrl);

        if (!jsRes.ok) {
            throw new Error(`Failed to fetch JS bundle: ${jsRes.status} ${jsRes.statusText}`);
        }

        const jsContent = await jsRes.text();
        console.log(`   Bundle size: ${jsContent.length} bytes`);

        // 2. Check for unique strings added in recent commits
        // String: "訪客模式" (Guest Mode) added in HomeScreen
        // String: "message-templates" (API path)
        // String: "checkProfileCompletion" (Function name)

        const checks = [
            { term: '訪客模式', desc: 'Guest Mode Alert (HomeScreen Fix)' },
            { term: '簽到功能需要先登入或註冊會員', desc: 'Guest Mode Detail Text' },
            { term: 'MessageTemplates', desc: 'Navigation Fix (ProfileScreen)' },
            { term: 'lineId', desc: 'LineID support' }
        ];

        console.log('\n🧪 verification Results:');
        let allPassed = true;
        for (const check of checks) {
            // Encode if necessary, but usually raw bundle still has readable strings if not heavily obfuscated
            // Webpack production build minifies, but strings often remain strings.
            // Chinese characters might be unicode escaped. 
            // "訪客模式" might become "\u8A2A\u5BA2\u6A21\u5F0F"

            // Simple check definition
            const found = jsContent.includes(check.term) || jsContent.includes(check.term.replace(/./g, (c) => '\\u' + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')));

            if (found) {
                console.log(`   ✅ FOUND: "${check.desc}"`);
            } else {
                console.log(`   ❌ MISSING: "${check.desc}"`);
                allPassed = false;
            }
        }

        if (allPassed) {
            console.log('\n🎉 The deployed frontend IS UP TO DATE.');
        } else {
            console.log('\n⚠️ The deployed frontend is STALE (Does not contain recent code).');
            console.log('   Action: We need to fix Vercel serving the wrong file.');
        }

    } catch (err) {
        console.error('🚨 Error verifying frontend:', err);
    }
}

checkFrontend();


import axios from 'axios';
import chalk from 'chalk';

const BASE_URL = 'https://alive-iota.vercel.app';

async function diagnose() {
    console.log(chalk.blue(`🔍 Starting Production Diagnosis for: ${BASE_URL}\n`));

    const endpoints = [
        { name: 'Health Check', path: '/api/health', method: 'GET' },
        { name: 'API Root', path: '/api', method: 'GET' },
        // If you have a known safe public endpoint, list it here
    ];

    let hasErrors = false;

    for (const ep of endpoints) {
        const url = `${BASE_URL}${ep.path}`;
        console.log(`Testing ${chalk.yellow(ep.name)} (${url})...`);

        try {
            const response = await axios({
                method: ep.method,
                url: url,
                validateStatus: () => true // Don't throw on error status
            });

            const contentType = response.headers['content-type'] || '';
            const isJson = contentType.includes('application/json');
            const isHtml = contentType.includes('text/html');

            if (response.status === 200 && isJson) {
                console.log(chalk.green(`✅ [PASS] Status: ${response.status}, Type: JSON`));
                // console.log('   Data:', JSON.stringify(response.data).slice(0, 100) + '...');
            } else if (isHtml) {
                console.log(chalk.red(`❌ [FAIL] Received HTML instead of JSON`));
                console.log(chalk.gray(`   This usually means Vercel is returning the 404 fallback page because the API route is missing or misconfigured.`));
                hasErrors = true;
            } else {
                console.log(chalk.red(`❌ [FAIL] Unexpected Status: ${response.status}, Type: ${contentType}`));
                hasErrors = true;
            }

        } catch (error: any) {
            console.log(chalk.red(`❌ [NETWORK ERROR] ${error.message}`));
            hasErrors = true;
        }
        console.log('---');
    }

    if (hasErrors) {
        console.log(chalk.red('\n🚩 Diagnosis: The API is likely NOT deployed correctly.'));
        console.log('   Reason: Requests are returning HTML (Frontend app) instead of JSON (Backend API).');
        console.log('   Fix: Ensure `api/index.ts` is building and Vercel routing is correct.');
    } else {
        console.log(chalk.green('\n✨ Diagnosis: API endpoints appear to be reachable and returning JSON.'));
    }
}

diagnose();

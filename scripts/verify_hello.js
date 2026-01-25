const https = require('https');

const options = {
    hostname: 'alive-iota.vercel.app',
    port: 443,
    path: '/api/hello',
    method: 'GET'
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    const ct = res.headers['content-type'];
    console.log(`Content-Type: ${ct}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(e);
});
req.end();

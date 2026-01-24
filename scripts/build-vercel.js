const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const aliveAppDir = path.join(rootDir, 'AliveApp');
const publicDir = path.join(rootDir, 'public');

console.log('🚀 Starting Vercel Build Script for AliveApp...');

try {
    // 1. Install and Build AliveApp
    console.log('📦 Building AliveApp (RN Webpack Build)...');

    // Force clean install to prevent caching issues
    console.log('🧹 Cleaning previous artifacts...');
    if (fs.existsSync(path.join(aliveAppDir, 'dist'))) {
        fs.rmSync(path.join(aliveAppDir, 'dist'), { recursive: true, force: true });
    }

    console.log('⬇️ Installing dependencies...');
    execSync('npm install', { cwd: aliveAppDir, stdio: 'inherit' });

    console.log('🏗️ Building Web Assets...');
    execSync('npm run build:web', { cwd: aliveAppDir, stdio: 'inherit' });

    // 2. Prepare Root Public Directory
    console.log('📂 Preparing public directory...');
    if (fs.existsSync(publicDir)) {
        fs.rmSync(publicDir, { recursive: true, force: true });
    }
    fs.mkdirSync(publicDir);

    // 3. Copy Build Artifacts
    const distDir = path.join(aliveAppDir, 'dist');
    if (!fs.existsSync(distDir)) {
        throw new Error('Build failed: AliveApp/dist directory not found!');
    }

    console.log(`📋 Copying files from ${distDir} to ${publicDir}...`);
    fs.cpSync(distDir, publicDir, { recursive: true });

    console.log('✅ Build & Copy Complete!');
} catch (error) {
    console.error('❌ Build Script Failed:', error);
    process.exit(1);
}

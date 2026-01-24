const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const aliveExpoDir = path.join(rootDir, 'AliveExpo');
const publicDir = path.join(rootDir, 'public');

console.log('🚀 Starting Vercel Build Script for AliveExpo...');

try {
    // 1. Install and Build AliveExpo
    console.log('📦 Building AliveExpo...');

    // Clean previous dist but preserve node_modules for cache
    if (fs.existsSync(path.join(aliveExpoDir, 'dist'))) {
        console.log('🧹 Cleaning previous dist...');
        fs.rmSync(path.join(aliveExpoDir, 'dist'), { recursive: true, force: true });
    }

    console.log('⬇️ Installing dependencies...');
    execSync('npm install', { cwd: aliveExpoDir, stdio: 'inherit' });

    console.log('🏗️ generic Expo Web Export...');
    // Ensure we use the locally installed expo CLI
    execSync('npx expo export --platform web', { cwd: aliveExpoDir, stdio: 'inherit' });

    // 2. Prepare Root Public Directory
    console.log('📂 Preparing public directory...');
    if (fs.existsSync(publicDir)) {
        fs.rmSync(publicDir, { recursive: true, force: true });
    }
    fs.mkdirSync(publicDir);

    // 3. Copy Build Artifacts
    const distDir = path.join(aliveExpoDir, 'dist');
    if (!fs.existsSync(distDir)) {
        throw new Error('Build failed: AliveExpo/dist directory not found!');
    }

    console.log(`📋 Copying files from ${distDir} to ${publicDir}...`);
    fs.cpSync(distDir, publicDir, { recursive: true });

    console.log('✅ Build & Copy Complete!');
} catch (error) {
    console.error('❌ Build Script Failed:', error);
    process.exit(1);
}

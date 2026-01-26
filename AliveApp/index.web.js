/**
 * ALIVE愛來 APP - Web 版入口 (Async Loading Mode)
 */

import 'react-native-gesture-handler';
if (typeof window !== 'undefined') {
    // Polyfill check
    if (!window.exports) window.exports = {};
    console.log('--- JS EXECUTION STARTED (Async Mode) ---');
}

import React from 'react';
import { AppRegistry } from 'react-native';
import appConfig from './app.json';
const appName = appConfig.name;

// Static Import Mode (Fix for Vercel freeze)
import App from './App';

// Register Component
AppRegistry.registerComponent(appName, () => App);

// Mount Application
if (typeof document !== 'undefined') {
    const rootTag = document.getElementById('root');

    // Hide default loading HTML immediately
    const loadingElement = document.getElementById('loading');
    if (loadingElement) loadingElement.style.display = 'none';

    AppRegistry.runApplication(appName, { rootTag });
}

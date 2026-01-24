/**
 * ALIVE愛來 APP - Web 版入口 (Production Mode)
 */

if (typeof window !== 'undefined') {
    console.log('--- JS EXECUTION STARTED ---');
}

import React from 'react';
import { AppRegistry, View, Text, ScrollView } from 'react-native';
import { name as appName } from './app.json';
import App from './App';
import GlobalErrorBoundary from './src/components/GlobalErrorBoundary';

const updateLoadingText = (msg) => {
    if (typeof document !== 'undefined') {
        const el = document.getElementById('loading-text');
        if (el) el.innerText = msg;
    }
};

try {
    updateLoadingText('註冊應用組件...');
    AppRegistry.registerComponent(appName, () => () => (
        <GlobalErrorBoundary>
            <App />
        </GlobalErrorBoundary>
    ));
} catch (e) {
    console.error('Registration Error', e);
    updateLoadingText('註冊失敗: ' + e.message);
}

// Web 版本掛載
if (typeof document !== 'undefined') {
    const rootTag = document.getElementById('root');
    try {
        AppRegistry.runApplication(appName, { rootTag });

        // Hide loading screen
        setTimeout(() => {
            const loadingElement = document.getElementById('loading');
            if (loadingElement) loadingElement.style.display = 'none';
        }, 500);

    } catch (e) {
        console.error('Run App Error:', e);
    }
}

/**
 * ALIVE愛來 APP - Web 版入口 (Diagnostic Mode)
 */

if (typeof window !== 'undefined') {
    console.log('--- JS EXECUTION STARTED ---');
    const loadingText = document.getElementById('loading-text');
    if (loadingText) loadingText.innerText = 'JS已載入，正在初始化...';
}

import React from 'react';
import { AppRegistry, View, Text } from 'react-native';
import { name as appName } from './app.json';

// import App from './App'; // <--- SUSPECT: Import causes crash?
// import GlobalErrorBoundary from './src/components/GlobalErrorBoundary';

const DiagnosticApp = () => (
    <View style={{ flex: 1, backgroundColor: '#2d3436', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#00cec9', fontSize: 24, fontWeight: 'bold' }}>
            Diagnostic Mode Active
        </Text>
        <Text style={{ color: 'white', marginTop: 10 }}>
            If you see this, "App.tsx" dependencies are crashing the app.
        </Text>
    </View>
);

const updateLoadingText = (msg) => {
    if (typeof document !== 'undefined') {
        const el = document.getElementById('loading-text');
        if (el) el.innerText = msg;
    }
};

try {
    updateLoadingText('註冊診斷組件...');
    AppRegistry.registerComponent(appName, () => DiagnosticApp);
} catch (e) {
    updateLoadingText('註冊失敗: ' + e.message);
}

// Web 版本掛載
if (typeof document !== 'undefined') {
    const rootTag = document.getElementById('root');
    try {
        updateLoadingText('掛載診斷模式...');
        AppRegistry.runApplication(appName, { rootTag });

        // Hide loading
        setTimeout(() => {
            const loadingElement = document.getElementById('loading');
            if (loadingElement) loadingElement.style.display = 'none';
        }, 1000);

    } catch (e) {
        updateLoadingText('掛載失敗: ' + e.message);
    }
}

/**
 * ALIVE愛來 APP - Web 版入口 (Production Mode)
 */

if (typeof window !== 'undefined') {
    console.log('--- JS EXECUTION STARTED ---');
}

import React from 'react';
import { AppRegistry, View, Text, ScrollView, Platform } from 'react-native';
import { name as appName } from './app.json';
import GlobalErrorBoundary from './src/components/GlobalErrorBoundary';

const updateLoadingText = (msg) => {
    if (typeof document !== 'undefined') {
        const el = document.getElementById('loading-text');
        if (el) el.innerText = msg;
    }
};

// 安全載入器：動態載入 App 以捕獲靜態導入無法捕獲的錯誤
let App;
let loadError = null;

try {
    updateLoadingText('正在載入應用核心...');
    const AppMod = require('./App');
    App = AppMod.default || AppMod;
    updateLoadingText('應用核心已載入');
} catch (e) {
    console.error('CRITICAL IMPORT ERROR:', e);
    loadError = e;
    updateLoadingText('核心錯誤: ' + e.message);
}

// 錯誤顯示畫面
const LoadErrorScreen = ({ error }) => (
    <View style={{ flex: 1, backgroundColor: '#d63031', padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
            啟動失敗 (Startup Failed)
        </Text>
        <ScrollView style={{ width: '100%', maxHeight: 400, backgroundColor: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 10 }}>
            <Text style={{ color: '#ff7675', fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>
                {error?.message}
            </Text>
            {error?.stack && (
                <Text style={{ color: '#dfe6e9', fontFamily: 'monospace', fontSize: 12 }}>
                    {error.stack}
                </Text>
            )}
        </ScrollView>
        <Text style={{ color: 'rgba(255,255,255,0.6)', marginTop: 20 }}>
            請截圖此畫面回報給開發者
        </Text>
    </View>
);

try {
    if (loadError) {
        AppRegistry.registerComponent(appName, () => () => <LoadErrorScreen error={loadError} />);
    } else {
        AppRegistry.registerComponent(appName, () => () => (
            <GlobalErrorBoundary>
                <App />
            </GlobalErrorBoundary>
        ));
    }
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

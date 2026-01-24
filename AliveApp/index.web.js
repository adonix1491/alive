/**
 * ALIVE愛來 APP - Web 版入口 (Safe Loader Mode)
 */

if (typeof window !== 'undefined') {
    console.log('--- JS EXECUTION STARTED ---');
}

import React from 'react';
import { AppRegistry, View, Text, ScrollView } from 'react-native';
import { name as appName } from './app.json';
import GlobalErrorBoundary from './src/components/GlobalErrorBoundary';

const updateLoadingText = (msg) => {
    if (typeof document !== 'undefined') {
        const el = document.getElementById('loading-text');
        if (el) el.innerText = msg;
    }
};

let App;
let loadError = null;

try {
    updateLoadingText('正在載入應用核心...');
    // 使用 require 動態載入，以便捕獲依賴錯誤
    const AppMod = require('./App');
    App = AppMod.default || AppMod;
    updateLoadingText('應用核心已載入');
} catch (e) {
    console.error('CRITICAL IMPORT ERROR:', e);
    loadError = e;
    updateLoadingText('應用核心載入失敗: ' + e.message);
}

// 錯誤顯示組件
const LoadErrorScreen = ({ error }) => (
    <View style={{ flex: 1, backgroundColor: '#d63031', padding: 20, justifyContent: 'center' }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
            核心啟動失敗 ☠️
        </Text>
        <Text style={{ color: 'white', fontSize: 16, marginBottom: 10 }}>
            App.tsx 或其依賴項發生錯誤：
        </Text>
        <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 5, maxHeight: 300 }}>
            <Text style={{ color: '#ffeaa7', fontFamily: 'monospace' }}>
                {error?.message || 'Unknown Error'}
            </Text>
            {error?.stack && (
                <Text style={{ color: '#fab1a0', fontSize: 12, marginTop: 10 }}>
                    {error.stack}
                </Text>
            )}
        </ScrollView>
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

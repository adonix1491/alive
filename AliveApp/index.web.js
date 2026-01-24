/**
 * ALIVE愛來 APP - Web 版入口 (Async Loading Mode)
 */

import 'react-native-gesture-handler';
if (typeof window !== 'undefined') {
    // Polyfill check
    if (!window.exports) window.exports = {};
    console.log('--- JS EXECUTION STARTED (Async Mode) ---');
}

import React, { useState, useEffect } from 'react';
import { AppRegistry, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { name as appName } from './app.json';

// Simple inline styles to avoid dependency issues
const styles = {
    container: { flex: 1, backgroundColor: '#00B894', justifyContent: 'center', alignItems: 'center' },
    errorContainer: { flex: 1, backgroundColor: '#d63031', padding: 20, justifyContent: 'center' },
    whiteText: { color: 'white', fontSize: 16 },
    title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    errorBox: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 5, maxHeight: 300, width: '100%' }
};

// Async Loader Root Component
const AsyncRoot = () => {
    const [AppModule, setAppModule] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadApp = async () => {
            try {
                // Dynamic import isolates the App code from the entry point
                console.log('Attempting to import App.tsx dynamically...');
                const module = await import('./App');
                console.log('App.tsx loaded successfully');
                setAppModule(() => module.default);
            } catch (err) {
                console.error('Failed to load App:', err);
                setError(err);
            }
        };

        loadApp();
    }, []);

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.title}>啟動錯誤 (Load Failed)</Text>
                <Text style={[styles.whiteText, { marginBottom: 10 }]}>{error.message}</Text>
                <ScrollView style={styles.errorBox}>
                    <Text style={{ ...styles.whiteText, fontFamily: 'monospace', fontSize: 12 }}>
                        {error.stack}
                    </Text>
                </ScrollView>
            </View>
        );
    }

    if (!AppModule) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="white" />
                <Text style={[styles.whiteText, { marginTop: 20 }]}>正在載入核心模組...</Text>
            </View>
        );
    }

    const App = AppModule;
    return <App />;
};

// Register
try {
    AppRegistry.registerComponent(appName, () => AsyncRoot);
} catch (e) {
    console.error('Registration failed', e);
}

// Mount
if (typeof document !== 'undefined') {
    const rootTag = document.getElementById('root');
    // Hide default loading HTML immediately since React handles it now
    const loadingElement = document.getElementById('loading');
    if (loadingElement) loadingElement.style.display = 'none';

    AppRegistry.runApplication(appName, { rootTag });
}

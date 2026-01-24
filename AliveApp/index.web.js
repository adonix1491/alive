/**
 * ALIVE愛來 APP - Web 版入口 (Debug Mode)
 */
// 1. Immediate Alert to prove JS is running
if (typeof window !== 'undefined') {
    console.log('JS Bundle Loaded');
    // window.alert('DEBUG: JS Bundle Loaded'); // Commented out to be less annoying, uncomment if desperate
}

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import GlobalErrorBoundary from './src/components/GlobalErrorBoundary';

// 2. Visible Logger on Screen
const updateLoadingText = (msg) => {
    if (typeof document !== 'undefined') {
        const el = document.getElementById('loading-text');
        if (el) el.innerText = msg;
        console.log('[Boot]', msg);
    }
};

updateLoadingText('JS正在初始化...');

try {
    // 3. Register App with Error Boundary
    AppRegistry.registerComponent(appName, () => () => (
        <GlobalErrorBoundary>
            <App />
        </GlobalErrorBoundary>
    ));
    updateLoadingText('App已註冊');
} catch (e) {
    updateLoadingText('註冊失敗: ' + e.message);
    console.error(e);
}

// 4. Mount App
if (typeof document !== 'undefined') {
    const rootTag = document.getElementById('root');

    // Error Handlers
    window.onerror = function (message, source, lineno, colno, error) {
        updateLoadingText('全局錯誤: ' + message);
        console.error('Window Error:', message, error);
        return false;
    };

    window.addEventListener('unhandledrejection', function (event) {
        updateLoadingText('非同步錯誤: ' + (event.reason ? event.reason.message : 'Unknown'));
        console.error('Unhandled Rejection:', event.reason);
    });

    try {
        updateLoadingText('準備掛載...');

        AppRegistry.runApplication(appName, { rootTag });

        // Delay hiding loading screen to ensure render happened
        setTimeout(() => {
            // Check if root is empty?
            if (rootTag && rootTag.children.length === 0) {
                updateLoadingText('警告: 掛載後Root為空');
            } else {
                // Hide loading screen
                const loadingElement = document.getElementById('loading');
                if (loadingElement) loadingElement.style.display = 'none';
            }
        }, 2000);

    } catch (e) {
        updateLoadingText('掛載失敗: ' + e.message);
        console.error('Run App Error:', e);
    }
}

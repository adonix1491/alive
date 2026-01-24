/**
 * ALIVE愛來 APP - Web 版入口
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import GlobalErrorBoundary from './src/components/GlobalErrorBoundary';

// 註冊 App
AppRegistry.registerComponent(appName, () => () => (
    <GlobalErrorBoundary>
        <App />
    </GlobalErrorBoundary>
));

// Web 版本掛載
if (typeof document !== 'undefined') {
    const rootTag = document.getElementById('root');

    // Global Error Handler
    window.onerror = function (message, source, lineno, colno, error) {
        console.error('Global Error:', message, error);
        const loadingText = document.getElementById('loading-text');
        if (loadingText) loadingText.innerText = '系統發生錯誤: ' + message;
        return false;
    };

    window.addEventListener('unhandledrejection', function (event) {
        // Prevent default console logging
        // event.preventDefault();
        console.error('Unhandled Rejection:', event.reason);
        const loadingText = document.getElementById('loading-text');
        if (loadingText) loadingText.innerText = '非同步錯誤: ' + (event.reason ? event.reason.message || event.reason : 'Unknown');
    });

    // Immediate feedback
    const loadingText = document.getElementById('loading-text');
    if (loadingText) loadingText.innerText = '初始化中...';

    try {
        // 隱藏載入畫面
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            setTimeout(() => {
                loadingElement.style.opacity = '0';
                loadingElement.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    loadingElement.style.display = 'none';
                }, 500);
            }, 500);
        }

        AppRegistry.runApplication(appName, { rootTag });
    } catch (e) {
        console.error('App Mount Error:', e);
        const loadingText = document.getElementById('loading-text');
        if (loadingText) loadingText.innerText = '啟動失敗: ' + e.message;
    }
}

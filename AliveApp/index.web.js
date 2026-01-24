/**
 * ALIVE愛來 APP - Web 版入口
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// 註冊 App
AppRegistry.registerComponent(appName, () => App);

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

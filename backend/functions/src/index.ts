import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// 初始化 Admin SDK
if (!admin.apps.length) {
    admin.initializeApp();
}

// 匯出功能
export { checkInStatus } from './checkInScheduler';

// 簡單的 Hello World 測試
export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from ALIVE Functions!");
});

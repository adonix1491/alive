import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as moment from 'moment-timezone';
import { sendLineNotification } from './lineService';

const db = admin.firestore();

/**
 * 每日檢查簽到狀態
 * 頻率：每天早上 10:00 (台北時間)
 */
export const checkInStatus = functions.pubsub
    .schedule('0 10 * * *')
    .timeZone('Asia/Taipei')
    .onRun(async (context) => {
        functions.logger.info('開始檢查每日簽到狀態...', { timestamp: context.timestamp });

        try {
            // 1. 查詢所有「已啟用 LINE 通知」且「有設定聯絡人」的用戶
            // 注意：這裡假設 users collection 中有 lineToken 欄位 (綁定後儲存)
            // 若是真實場景，可能需要更複雜的 Query 或分批處理
            const usersSnapshot = await db.collection('settings')
                .where('lineConnected', '==', true)
                .where('lineToken', '!=', null) // 需確保有 Token
                .get();

            if (usersSnapshot.empty) {
                functions.logger.info('沒有需要檢查的用戶');
                return null;
            }

            const promises: Promise<void>[] = [];

            // 2. 遍歷用戶並檢查
            for (const doc of usersSnapshot.docs) {
                const settings = doc.data();
                const userId = doc.id; // 假設 settings ID 與 userId 對應

                // 讀取該用戶的最後簽到記錄
                // 這邊假設有一個 checkIns collection，存有 lastCheckInTime
                // 或者直接讀取 user profile 中的 lastCheckIn 欄位
                // 為了簡化，假設 user doc 本身就有 lastCheckIn
                const userDoc = await db.collection('users').doc(userId).get();
                const userData = userDoc.data();

                if (!userData || !userData.lastCheckIn) {
                    functions.logger.warn(`用戶 ${userId} 無簽到記錄`);
                    continue;
                }

                const lastCheckInTime = userData.lastCheckIn.toDate(); // Firestore Timestamp 轉 Date
                const notifyDays = parseInt(settings.notifyDays || '2', 10);

                //計算天數差距
                const now = moment().tz('Asia/Taipei');
                const lastCheckIn = moment(lastCheckInTime).tz('Asia/Taipei');
                const diffDays = now.diff(lastCheckIn, 'days');

                functions.logger.info(`用戶 ${userId}: 上次簽到 ${lastCheckIn.format()} (${diffDays} 天前), 設定閾值: ${notifyDays}`);

                // 3. 如果超過設定天數，發送通知
                if (diffDays >= notifyDays) {
                    const message = `
【緊急通知】
您的親友 (ID: ${userId}) 已超過 ${diffDays} 天未簽到。
設定的警戒值為 ${notifyDays} 天。
請盡速確認其安全狀況。

— ALIVE愛來 安全守護系統
          `.trim();

                    const task = sendLineNotification(settings.lineToken, message)
                        .then(() => functions.logger.info(`已通知用戶 ${userId}`))
                        .catch(err => functions.logger.error(`通知失敗 ${userId}`, err));

                    promises.push(task);
                }
            }

            await Promise.all(promises);
            functions.logger.info('每日檢查完成');

        } catch (error) {
            functions.logger.error('檢查流程發生錯誤', error);
        }
    });

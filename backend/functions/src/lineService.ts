import axios from 'axios';
import * as functions from 'firebase-functions';

/**
 * 發送 LINE Notify 通知
 * @param token 用戶的 LINE Notify Token
 * @param message 要發送的訊息
 */
export async function sendLineNotification(token: string, message: string) {
    try {
        const formData = new URLSearchParams();
        formData.append('message', message);

        await axios.post('https://notify-api.line.me/api/notify', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`,
            },
        });

        functions.logger.info('LINE notification sent successfully');
    } catch (error) {
        functions.logger.error('Error sending LINE notification:', error);
        // 不拋出錯誤，避免中斷其他通知
    }
}

/**
 * 通知服務
 * 處理通知設定和 Email 驗證
 */
import { authenticatedRequest, ApiResponse } from './config';
import authService from './authService';

/**
 * 通知設定介面
 */
export interface NotificationSettings {
    emailEnabled: boolean;
    emailAddress?: string;
    emailVerified: boolean;
    lineEnabled: boolean;
    lineUserId?: string;
    lineVerified: boolean;
    pushEnabled: boolean;
}

/**
 * 更新設定參數
 */
export interface UpdateSettingsParams {
    emailEnabled?: boolean;
    emailAddress?: string;
    lineEnabled?: boolean;
    pushEnabled?: boolean;
}

class NotificationService {
    /**
     * 取得通知設定
     */
    async getSettings(): Promise<ApiResponse<NotificationSettings>> {
        const token = await authService.getToken();
        if (!token) {
            return { error: { code: 'NO_TOKEN', message: '未登入' } };
        }

        return authenticatedRequest('/notifications/settings', token, {
            method: 'GET',
        });
    }

    /**
     * 更新通知設定
     */
    async updateSettings(params: UpdateSettingsParams): Promise<ApiResponse<NotificationSettings>> {
        const token = await authService.getToken();
        if (!token) {
            return { error: { code: 'NO_TOKEN', message: '未登入' } };
        }

        return authenticatedRequest('/notifications/settings', token, {
            method: 'PUT',
            body: JSON.stringify(params),
        });
    }

    /**
     * 發送 Email 驗證碼
     */
    async sendEmailVerification(email: string): Promise<ApiResponse<{ message: string; email: string; expiresIn: number }>> {
        const token = await authService.getToken();
        if (!token) {
            return { error: { code: 'NO_TOKEN', message: '未登入' } };
        }

        return authenticatedRequest('/notifications/verify-email', token, {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    /**
     * 確認 Email 驗證碼
     */
    async confirmEmail(code: string): Promise<ApiResponse<{ message: string; settings: NotificationSettings }>> {
        const token = await authService.getToken();
        if (!token) {
            return { error: { code: 'NO_TOKEN', message: '未登入' } };
        }

        return authenticatedRequest('/notifications/confirm-email', token, {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
    }
}

export default new NotificationService();

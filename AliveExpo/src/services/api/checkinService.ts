/**
 * 簽到服務
 * 處理簽到記錄相關功能
 */
import { authenticatedRequest, ApiResponse } from './config';
import authService from './authService';
import { CheckInRecord } from '../../types';

/**
 * 建立簽到參數
 */
export interface CreateCheckInParams {
    location?: {
        latitude: number;
        longitude: number;
    };
    note?: string;
}

/**
 * 簽到歷史回應
 */
export interface CheckInHistoryResponse {
    history: CheckInRecord[];
    total: number;
}

class CheckInService {
    /**
     * 建立簽到
     */
    async createCheckIn(params?: CreateCheckInParams): Promise<ApiResponse<{ checkIn: CheckInRecord }>> {
        const token = await authService.getToken();
        if (!token) {
            return { error: { code: 'NO_TOKEN', message: '未登入' } };
        }

        return authenticatedRequest('/checkin', token, {
            method: 'POST',
            body: JSON.stringify(params || {}),
        });
    }

    /**
     * 取得簽到歷史
     */
    async getHistory(limit: number = 20, offset: number = 0): Promise<ApiResponse<CheckInHistoryResponse>> {
        const token = await authService.getToken();
        if (!token) {
            return { error: { code: 'NO_TOKEN', message: '未登入' } };
        }

        return authenticatedRequest<CheckInHistoryResponse>(
            `/checkin/history?limit=${limit}&offset=${offset}`,
            token,
            { method: 'GET' }
        );
    }
}

export default new CheckInService();

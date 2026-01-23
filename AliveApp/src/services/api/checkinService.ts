/**
 * 簽到服務
 * 處理簽到記錄相關功能
 */
import { authenticatedRequest, ApiResponse } from './config';
import authService from './authService';

/**
 * 簽到記錄介面
 */
export interface CheckIn {
    id: number;
    userId: number;
    timestamp: string;
    status: 'completed' | 'missed' | 'pending';
    location?: {
        latitude: number;
        longitude: number;
    };
}

/**
 * 建立簽到參數
 */
export interface CreateCheckInParams {
    location?: {
        latitude: number;
        longitude: number;
    };
}

/**
 * 簽到歷史回應
 */
export interface CheckInHistoryResponse {
    checkIns: CheckIn[];
    limit: number;
    offset: number;
}

class CheckInService {
    /**
     * 建立簽到
     */
    async createCheckIn(params?: CreateCheckInParams): Promise<ApiResponse<{ message: string; checkIn: CheckIn }>> {
        const token = await authService.getToken();
        if (!token) {
            return { error: { code: 'NO_TOKEN', message: '未登入' } };
        }

        return authenticatedRequest('/checkin', token, {
            method: 'POST',
            body: JSON.stringify(params || {}),
        });
    }

    // Helper for debug
    async getToken() {
        return authService.getToken();
    }

    /**
     * 取得簽到歷史
     */
    async getHistory(limit: number = 30, offset: number = 0): Promise<ApiResponse<CheckInHistoryResponse>> {
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

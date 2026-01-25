/**
 * 認證服務
 * 處理用戶註冊、登入和認證相關功能
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest, authenticatedRequest, AUTH_TOKEN_KEY, ApiResponse } from './config';

/**
 * 用戶資料介面
 */
export interface User {
    id: number;
    email: string;
    name: string;
    phoneNumber?: string;
    lineId?: string; // Added lineId
    avatarUrl?: string;
}

/**
 * 註冊參數
 */
export interface RegisterParams {
    email: string;
    password: string;
    name: string;
    phoneNumber?: string;
}

/**
 * 更新個人資料參數
 */
export interface UpdateProfileParams {
    name?: string;
    phoneNumber?: string;
    lineId?: string; // Added lineId
}

/**
 * 登入參數
 */
export interface LoginParams {
    email: string;
    password: string;
}

/**
 * 認證回應
 */
export interface AuthResponse {
    token: string;
    user: User;
}

class AuthService {
    /**
     * 用戶註冊
     */
    async register(params: RegisterParams): Promise<ApiResponse<AuthResponse>> {
        const response = await apiRequest<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(params),
        });

        // 註冊成功後自動儲存 token
        if (response.data) {
            await this.saveToken(response.data.token);
        }

        return response;
    }

    /**
     * 用戶登入
     */
    async login(params: LoginParams): Promise<ApiResponse<AuthResponse>> {
        const response = await apiRequest<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(params),
        });

        // 登入成功後自動儲存 token
        if (response.data) {
            await this.saveToken(response.data.token);
        }

        return response;
    }

    /**
     * 訪客登入 (手機號碼綁定)
     */
    async guestLogin(params: { phoneNumber: string; name?: string; email?: string; lineId?: string }): Promise<ApiResponse<AuthResponse>> {
        const response = await apiRequest<AuthResponse>('/auth/guest-login', {
            method: 'POST',
            body: JSON.stringify(params),
        });

        // 登入成功後自動儲存 token
        if (response.data) {
            await this.saveToken(response.data.token);
        }

        return response;
    }

    /**
     * 取得當前使用者資訊
     */
    async getMe(): Promise<ApiResponse<User>> {
        const token = await this.getToken();
        if (!token) {
            return {
                error: {
                    code: 'NO_TOKEN',
                    message: '未登入',
                },
            };
        }

        return authenticatedRequest<User>('/auth/me', token, {
            method: 'GET',
        });
    }

    /**
     * 更新個人資料
     */
    async updateProfile(params: UpdateProfileParams): Promise<ApiResponse<{ user: User }>> {
        const token = await this.getToken();
        if (!token) {
            return {
                error: {
                    code: 'NO_TOKEN',
                    message: '未登入',
                },
            };
        }

        return authenticatedRequest<{ user: User }>('/user/profile', token, {
            method: 'PUT',
            body: JSON.stringify(params),
        });
    }

    /**
     * 登出
     */
    async logout(): Promise<void> {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }

    /**
     * 儲存 Token
     */
    async saveToken(token: string): Promise<void> {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    /**
     * 取得 Token
     */
    async getToken(): Promise<string | null> {
        return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    }

    /**
     * 檢查是否已登入
     */
    async isAuthenticated(): Promise<boolean> {
        const token = await this.getToken();
        return !!token;
    }
}

export default new AuthService();

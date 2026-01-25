/**
 * API 配置
 * 統一管理 API 基礎設定
 */

import { Platform } from 'react-native';

// API 基礎 URL
// Web 環境使用相對路徑以避免 CORS 並自動適配網域
// Native 環境使用完整 URL
export const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : 'https://alive-iota.vercel.app/api';

console.log('[Config] API_BASE_URL:', API_BASE_URL);

// Token 儲存 key
export const AUTH_TOKEN_KEY = '@alive_auth_token';

/**
 * API 錯誤類型
 */
export interface ApiError {
    code: string;
    message: string;
    details?: any;
}

/**
 * API 回應類型
 */
export interface ApiResponse<T = any> {
    data?: T;
    error?: ApiError;
}

/**
 * 發送 API 請求的通用函數
 */
export async function apiRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                error: data.error || {
                    code: 'UNKNOWN_ERROR',
                    message: '發生未知錯誤',
                },
            };
        }

        return { data };
    } catch (error: any) {
        return {
            error: {
                code: 'NETWORK_ERROR',
                message: '網路錯誤，請檢查連線',
                details: error.message,
            },
        };
    }
}

/**
 * 發送需要認證的 API 請求
 */
export async function authenticatedRequest<T = any>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });
}

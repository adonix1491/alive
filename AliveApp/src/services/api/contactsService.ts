/**
 * 聯絡人服務
 * 處理緊急聯絡人 CRUD 功能
 */
import { authenticatedRequest, ApiResponse } from './config';
import authService from './authService';

/**
 * 緊急聯絡人介面
 */
export interface EmergencyContact {
    id: number;
    name: string;
    phone: string;
    email?: string;
    lineId?: string;
    relationship?: string;
    priority: number;
    isEnabled: boolean;
}

/**
 * 新增聯絡人參數
 */
export interface CreateContactParams {
    name: string;
    phone: string;
    email?: string;
    lineId?: string;
    relationship?: string;
    priority: number;
}

/**
 * 更新聯絡人參數
 */
export interface UpdateContactParams {
    name?: string;
    phone?: string;
    email?: string;
    lineId?: string;
    relationship?: string;
    priority?: number;
    isEnabled?: boolean;
}

class ContactsService {
    /**
     * 取得所有聯絡人
     */
    async getAll(): Promise<ApiResponse<{ contacts: EmergencyContact[] }>> {
        const token = await authService.getToken();
        if (!token) {
            return { error: { code: 'NO_TOKEN', message: '未登入' } };
        }

        return authenticatedRequest('/contacts', token, { method: 'GET' });
    }

    /**
     * 新增聯絡人
     */
    async create(params: CreateContactParams): Promise<ApiResponse<EmergencyContact>> {
        const token = await authService.getToken();
        if (!token) {
            return { error: { code: 'NO_TOKEN', message: '未登入' } };
        }

        return authenticatedRequest('/contacts', token, {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }

    /**
     * 更新聯絡人
     */
    async update(id: number, params: UpdateContactParams): Promise<ApiResponse<EmergencyContact>> {
        const token = await authService.getToken();
        if (!token) {
            return { error: { code: 'NO_TOKEN', message: '未登入' } };
        }

        return authenticatedRequest(`/contacts/${id}`, token, {
            method: 'PUT',
            body: JSON.stringify(params),
        });
    }

    /**
     * 刪除聯絡人
     */
    async delete(id: number): Promise<ApiResponse<{ message: string }>> {
        const token = await authService.getToken();
        if (!token) {
            return { error: { code: 'NO_TOKEN', message: '未登入' } };
        }

        return authenticatedRequest(`/contacts/${id}`, token, {
            method: 'DELETE',
        });
    }
}

export default new ContactsService();

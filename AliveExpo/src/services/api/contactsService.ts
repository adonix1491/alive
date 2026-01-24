/**
 * 聯絡人服務
 * 處理緊急聯絡人相關功能
 */
import { authenticatedRequest, ApiResponse } from './config';
import authService from './authService';
import { EmergencyContact } from '../../types';

class ContactsService {
    /**
     * 取得聯絡人列表
     */
    async getContacts(): Promise<ApiResponse<{ contacts: EmergencyContact[] }>> {
        const token = await authService.getToken();
        if (!token) return { error: { code: 'NO_TOKEN', message: '未登入' } };

        return authenticatedRequest<{ contacts: EmergencyContact[] }>('/contacts', token, {
            method: 'GET'
        });
    }

    /**
     * 新增聯絡人
     */
    async addContact(name: string, phoneNumber: string, relationship?: string, email?: string): Promise<ApiResponse<{ contact: EmergencyContact }>> {
        const token = await authService.getToken();
        if (!token) return { error: { code: 'NO_TOKEN', message: '未登入' } };

        return authenticatedRequest<{ contact: EmergencyContact }>('/contacts', token, {
            method: 'POST',
            body: JSON.stringify({ name, phoneNumber, relationship, email })
        });
    }

    /**
     * 刪除聯絡人
     */
    async deleteContact(id: number): Promise<ApiResponse<{ message: string }>> {
        const token = await authService.getToken();
        if (!token) return { error: { code: 'NO_TOKEN', message: '未登入' } };

        return authenticatedRequest<{ message: string }>(`/contacts/${id}`, token, {
            method: 'DELETE'
        });
    }

    /**
     * 更新聯絡人 (Optional, consistent with backend)
     */
    async updateContact(id: number, data: Partial<EmergencyContact>): Promise<ApiResponse<{ contact: EmergencyContact }>> {
        const token = await authService.getToken();
        if (!token) return { error: { code: 'NO_TOKEN', message: '未登入' } };

        return authenticatedRequest<{ contact: EmergencyContact }>(`/contacts/${id}`, token, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
}

export default new ContactsService();

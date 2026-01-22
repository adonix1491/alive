import { authenticatedRequest, ApiResponse } from './config';
import authService from './authService';

export interface MessageTemplate {
    id: number;
    type: string;
    title: string;
    content: string;
    isDefault: boolean;
}

export interface SaveTemplateParams {
    type: string; // 'custom'
    title?: string;
    content: string;
}

const messageService = {
    /**
     * 獲取訊息模板
     */
    getTemplates: async (): Promise<ApiResponse<{ templates: MessageTemplate[] }>> => {
        try {
            const token = await authService.getToken();
            if (!token) {
                return { error: { code: 'UNAUTHORIZED', message: '尚未登入' } };
            }
            return await authenticatedRequest('/message-templates', token, {
                method: 'GET',
            });
        } catch (error: any) {
            return { error: { code: 'NETWORK_ERROR', message: error.message } };
        }
    },

    /**
     * 儲存訊息模板
     */
    saveTemplate: async (params: SaveTemplateParams): Promise<ApiResponse<{ template: MessageTemplate }>> => {
        try {
            const token = await authService.getToken();
            if (!token) {
                return { error: { code: 'UNAUTHORIZED', message: '尚未登入' } };
            }
            return await authenticatedRequest('/message-templates', token, {
                method: 'POST',
                body: JSON.stringify(params),
            });
        } catch (error: any) {
            return { error: { code: 'NETWORK_ERROR', message: error.message } };
        }
    },
};

export default messageService;


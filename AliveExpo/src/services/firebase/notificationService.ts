/**
 * NotificationService - 通知服務
 * 處理各種通知渠道的發送
 */
import { NOTIFICATION_CHANNELS, DEFAULT_MESSAGE_TEMPLATES } from '../../constants';
import { EmergencyContact, MessageTemplate, NotificationChannel } from '../../types';

/**
 * 通知發送結果
 */
interface NotificationResult {
    channel: NotificationChannel;
    success: boolean;
    error?: string;
}

/**
 * 替換訊息模板中的變數
 * @param template 訊息模板
 * @param variables 變數值
 */
export const replaceTemplateVariables = (
    template: string,
    variables: Record<string, string>
): string => {
    let result = template;

    Object.entries(variables).forEach(([key, value]) => {
        result = result.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    });

    return result;
};

/**
 * 發送緊急通知給所有聯絡人
 * @param contacts 緊急聯絡人列表
 * @param template 訊息模板
 * @param variables 變數值
 */
export const sendEmergencyNotifications = async (
    contacts: EmergencyContact[],
    template: MessageTemplate,
    variables: Record<string, string>
): Promise<NotificationResult[]> => {
    const message = replaceTemplateVariables(template.content, variables);
    const results: NotificationResult[] = [];

    for (const contact of contacts) {
        if (!contact.isEnabled) continue;

        // 發送 Email
        if (contact.email) {
            const emailResult = await sendEmailNotification(contact.email, template.title, message);
            results.push(emailResult);
        }

        // 發送 Push 通知
        const pushResult = await sendPushNotification(contact.id, template.title, message);
        results.push(pushResult);
    }

    return results;
};

/**
 * 發送 Email 通知
 * @param email 收件人 Email
 * @param subject 郵件主題
 * @param body 郵件內容
 */
export const sendEmailNotification = async (
    email: string,
    subject: string,
    body: string
): Promise<NotificationResult> => {
    try {
        // TODO: 實作透過 Firebase Cloud Functions 發送 Email
        console.log(`發送 Email 至 ${email}: ${subject}`);

        return {
            channel: 'email',
            success: true,
        };
    } catch (error: any) {
        return {
            channel: 'email',
            success: false,
            error: error.message,
        };
    }
};

/**
 * 發送 Push 通知
 * @param userId 目標用戶 ID
 * @param title 通知標題
 * @param body 通知內容
 */
export const sendPushNotification = async (
    userId: string,
    title: string,
    body: string
): Promise<NotificationResult> => {
    try {
        // TODO: 實作透過 Firebase Cloud Messaging 發送推播
        console.log(`發送 Push 至 ${userId}: ${title}`);

        return {
            channel: 'push',
            success: true,
        };
    } catch (error: any) {
        return {
            channel: 'push',
            success: false,
            error: error.message,
        };
    }
};

/**
 * 發送 LINE 通知
 * @param accessToken LINE Notify Access Token
 * @param message 訊息內容
 */
export const sendLineNotification = async (
    accessToken: string,
    message: string
): Promise<NotificationResult> => {
    try {
        // TODO: 實作 LINE Notify API 呼叫
        console.log(`發送 LINE 通知: ${message}`);

        return {
            channel: 'line',
            success: true,
        };
    } catch (error: any) {
        return {
            channel: 'line',
            success: false,
            error: error.message,
        };
    }
};

/**
 * 獲取預設訊息模板
 * @param type 模板類型
 */
export const getDefaultMessageTemplate = (
    type: 'check_in' | 'emergency' | 'reminder'
): MessageTemplate => {
    const templates = {
        check_in: DEFAULT_MESSAGE_TEMPLATES.CHECK_IN,
        emergency: DEFAULT_MESSAGE_TEMPLATES.EMERGENCY,
        reminder: DEFAULT_MESSAGE_TEMPLATES.REMINDER,
    };

    const template = templates[type];

    return {
        id: `default_${type}`,
        userId: 'system',
        type,
        title: template.title,
        content: template.content,
        isDefault: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

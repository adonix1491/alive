/**
 * ALIVE愛來 APP - TypeScript 類型定義
 * 定義應用程式中使用的所有類型
 */

// 用戶資料類型
export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

// 簽到記錄類型
export interface CheckInRecord {
    id: string;
    userId: string;
    timestamp: Date;
    status: CheckInStatus;
    location?: {
        latitude: number;
        longitude: number;
    };
}

export type CheckInStatus = 'completed' | 'missed' | 'pending';

// 緊急聯絡人類型
export interface EmergencyContact {
    id: string;
    userId: string;
    name: string;
    phone: string;
    email?: string;
    relationship?: string;
    priority: number;
    isEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// 通知渠道類型
export type NotificationChannel = 'line' | 'email' | 'sms' | 'push';

// 通知設定類型
export interface NotificationSettings {
    userId: string;
    channels: {
        [key in NotificationChannel]: {
            enabled: boolean;
            verified: boolean;
            config?: Record<string, string>;
        };
    };
    checkInReminder: {
        enabled: boolean;
        time: string; // HH:mm 格式
    };
}

// 簽到機制設定
export interface CheckInSettings {
    userId: string;
    intervalDays: number; // 幾天未簽到後觸發通知
    graceHours: number; // 寬限時間（小時）
    reminderEnabled: boolean;
    reminderTime: string; // HH:mm 格式
}

// 訊息模板類型
export interface MessageTemplate {
    id: string;
    userId: string;
    type: MessageTemplateType;
    title: string;
    content: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type MessageTemplateType = 'check_in' | 'emergency' | 'reminder' | 'custom';

// 異常規則類型
export interface AnomalyRule {
    id: string;
    userId: string;
    name: string;
    description: string;
    condition: AnomalyCondition;
    isEnabled: boolean;
    notifyContacts: string[]; // 聯絡人 ID 陣列
    createdAt: Date;
    updatedAt: Date;
}

export interface AnomalyCondition {
    type: 'missed_checkin' | 'custom';
    days?: number; // 連續未簽到天數
}

// 應用程式狀態類型
export interface AppState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    todayCheckIn: CheckInRecord | null;
    lastCheckIn: CheckInRecord | null;
    emergencyContacts: EmergencyContact[];
    notificationSettings: NotificationSettings | null;
    checkInSettings: CheckInSettings | null;
}

// 導航路由參數類型
export type RootStackParamList = {
    Splash: undefined;
    Auth: undefined;
    Login: undefined;
    Register: undefined;
    Main: undefined;
    Home: undefined;
    Settings: undefined;
    EmergencyContacts: undefined;
    AddEmergencyContact: { contactId?: string };
    NotificationSettings: undefined;
    MessageTemplates: undefined;
    EditMessageTemplate: { templateId?: string };
    AnomalyRules: undefined;
    Profile: undefined;
};

// API 回應類型
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}

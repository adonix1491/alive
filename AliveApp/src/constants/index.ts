/**
 * ALIVE愛來 APP - 應用程式常數配置
 */

// 應用程式基本資訊
export const APP_INFO = {
    NAME: 'ALIVE愛來',
    VERSION: '1.0.0',
    BUILD_NUMBER: 1,
    SLOGAN: '每日一開，平安已達',
    DESCRIPTION: '讓關心您的人知道您平安',
};

// 預設簽到設定
export const DEFAULT_CHECK_IN_SETTINGS = {
    INTERVAL_DAYS: 2, // 預設 2 天未簽到後通知
    GRACE_HOURS: 4, // 預設 4 小時寬限期
    REMINDER_TIME: '09:00', // 預設早上 9 點提醒
};

// 緊急聯絡人限制
export const EMERGENCY_CONTACT_LIMITS = {
    MAX_CONTACTS: 5, // 最多 5 位緊急聯絡人
    MIN_CONTACTS: 1, // 至少需要 1 位
};

// 訊息模板預設內容
export const DEFAULT_MESSAGE_TEMPLATES = {
    CHECK_IN: {
        title: '平安報到',
        content: '我是 [姓名]，我很好，今天已完成簽到。',
    },
    EMERGENCY: {
        title: '緊急提醒',
        content: '我是 [姓名]，我已經連續 [天數] 天沒有活動了，快來檢查下我的身體狀態。',
    },
    REMINDER: {
        title: '簽到提醒',
        content: '您今天還沒有簽到，請記得打開 ALIVE愛來 報平安。',
    },
};

// 通知渠道配置
export const NOTIFICATION_CHANNELS = {
    LINE: {
        id: 'line',
        name: 'LINE Notify',
        icon: 'chatbubble-ellipses',
        description: '透過 LINE 接收通知',
    },
    EMAIL: {
        id: 'email',
        name: 'Email',
        icon: 'mail',
        description: '透過電子郵件接收通知',
    },
    SMS: {
        id: 'sms',
        name: '簡訊',
        icon: 'chatbox',
        description: '透過簡訊接收通知',
    },
    PUSH: {
        id: 'push',
        name: '推播通知',
        icon: 'notifications',
        description: '透過 APP 推播接收通知',
    },
};

// 本地儲存 Key
export const STORAGE_KEYS = {
    USER_TOKEN: '@alive_user_token',
    USER_DATA: '@alive_user_data',
    CHECK_IN_SETTINGS: '@alive_checkin_settings',
    NOTIFICATION_SETTINGS: '@alive_notification_settings',
    LAST_CHECK_IN: '@alive_last_checkin',
    ONBOARDING_COMPLETED: '@alive_onboarding_completed',
};

// Firebase Collection 名稱
export const FIREBASE_COLLECTIONS = {
    USERS: 'users',
    CHECK_INS: 'check_ins',
    EMERGENCY_CONTACTS: 'emergency_contacts',
    MESSAGE_TEMPLATES: 'message_templates',
    ANOMALY_RULES: 'anomaly_rules',
    NOTIFICATIONS: 'notifications',
};

// 應用程式路由名稱
export const ROUTES = {
    SPLASH: 'Splash',
    AUTH: 'Auth',
    LOGIN: 'Login',
    REGISTER: 'Register',
    MAIN: 'Main',
    HOME: 'Home',
    SETTINGS: 'Settings',
    EMERGENCY_CONTACTS: 'EmergencyContacts',
    ADD_EMERGENCY_CONTACT: 'AddEmergencyContact',
    NOTIFICATION_SETTINGS: 'NotificationSettings',
    MESSAGE_TEMPLATES: 'MessageTemplates',
    ANOMALY_RULES: 'AnomalyRules',
    PROFILE: 'Profile',
} as const;

export default {
    APP_INFO,
    DEFAULT_CHECK_IN_SETTINGS,
    EMERGENCY_CONTACT_LIMITS,
    DEFAULT_MESSAGE_TEMPLATES,
    NOTIFICATION_CHANNELS,
    STORAGE_KEYS,
    FIREBASE_COLLECTIONS,
    ROUTES,
};

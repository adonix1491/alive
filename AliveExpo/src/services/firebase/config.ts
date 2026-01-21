/**
 * Firebase 配置與初始化
 * NOTE: 請將 firebaseConfig 中的值替換為您的 Firebase 專案配置
 */
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getMessaging, Messaging } from 'firebase/messaging';

// Firebase 配置
// FIXME: 部署前請替換為實際的 Firebase 配置
const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
    measurementId: 'YOUR_MEASUREMENT_ID',
};

// 初始化 Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let messaging: Messaging | null = null;

/**
 * 初始化 Firebase 服務
 */
export const initializeFirebase = (): void => {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        // NOTE: Messaging 在 React Native 中需要額外配置
        // messaging = getMessaging(app);

        console.log('Firebase 初始化成功');
    } catch (error) {
        console.error('Firebase 初始化失敗:', error);
        throw error;
    }
};

/**
 * 獲取 Firebase Auth 實例
 */
export const getFirebaseAuth = (): Auth => {
    if (!auth) {
        throw new Error('Firebase Auth 尚未初始化');
    }
    return auth;
};

/**
 * 獲取 Firestore 實例
 */
export const getFirebaseDb = (): Firestore => {
    if (!db) {
        throw new Error('Firestore 尚未初始化');
    }
    return db;
};

/**
 * 獲取 Firebase Messaging 實例
 */
export const getFirebaseMessaging = (): Messaging | null => {
    return messaging;
};

export { app, auth, db, messaging };

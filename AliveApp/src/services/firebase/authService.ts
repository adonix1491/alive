/**
 * AuthService - 用戶認證服務
 * 處理登入、註冊、登出等認證操作
 */
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    User,
    UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from './config';
import { FIREBASE_COLLECTIONS } from '../../constants';
import { User as AppUser, ApiResponse } from '../../types';

/**
 * 使用電子郵件和密碼登入
 * @param email 電子郵箱
 * @param password 密碼
 */
export const loginWithEmail = async (
    email: string,
    password: string
): Promise<ApiResponse<UserCredential>> => {
    try {
        const auth = getFirebaseAuth();
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, data: result };
    } catch (error: any) {
        return {
            success: false,
            error: {
                code: error.code || 'auth/unknown',
                message: getAuthErrorMessage(error.code),
            },
        };
    }
};

/**
 * 使用電子郵件和密碼註冊
 * @param email 電子郵箱
 * @param password 密碼
 * @param name 用戶名稱
 */
export const registerWithEmail = async (
    email: string,
    password: string,
    name: string
): Promise<ApiResponse<UserCredential>> => {
    try {
        const auth = getFirebaseAuth();
        const db = getFirebaseDb();

        // 創建認證帳號
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // 建立用戶資料
        const userData: Omit<AppUser, 'id'> = {
            name,
            email,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await setDoc(
            doc(db, FIREBASE_COLLECTIONS.USERS, result.user.uid),
            userData
        );

        return { success: true, data: result };
    } catch (error: any) {
        return {
            success: false,
            error: {
                code: error.code || 'auth/unknown',
                message: getAuthErrorMessage(error.code),
            },
        };
    }
};

/**
 * 登出
 */
export const logout = async (): Promise<ApiResponse<void>> => {
    try {
        const auth = getFirebaseAuth();
        await signOut(auth);
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: {
                code: 'auth/logout-failed',
                message: '登出失敗，請稍後再試',
            },
        };
    }
};

/**
 * 發送密碼重設郵件
 * @param email 電子郵箱
 */
export const resetPassword = async (
    email: string
): Promise<ApiResponse<void>> => {
    try {
        const auth = getFirebaseAuth();
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: {
                code: error.code || 'auth/unknown',
                message: getAuthErrorMessage(error.code),
            },
        };
    }
};

/**
 * 獲取當前用戶
 */
export const getCurrentUser = (): User | null => {
    const auth = getFirebaseAuth();
    return auth.currentUser;
};

/**
 * 監聽認證狀態變化
 * @param callback 狀態變化回調
 */
export const subscribeToAuthState = (
    callback: (user: User | null) => void
): (() => void) => {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, callback);
};

/**
 * 獲取用戶資料
 * @param userId 用戶 ID
 */
export const getUserProfile = async (
    userId: string
): Promise<ApiResponse<AppUser>> => {
    try {
        const db = getFirebaseDb();
        const docRef = doc(db, FIREBASE_COLLECTIONS.USERS, userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                success: true,
                data: { id: docSnap.id, ...docSnap.data() } as AppUser,
            };
        } else {
            return {
                success: false,
                error: {
                    code: 'user/not-found',
                    message: '找不到用戶資料',
                },
            };
        }
    } catch (error: any) {
        return {
            success: false,
            error: {
                code: 'user/fetch-failed',
                message: '獲取用戶資料失敗',
            },
        };
    }
};

/**
 * 將 Firebase Auth 錯誤碼轉換為用戶友好訊息
 */
const getAuthErrorMessage = (code: string): string => {
    const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': '此電子郵箱已被註冊',
        'auth/invalid-email': '電子郵箱格式不正確',
        'auth/operation-not-allowed': '此操作不被允許',
        'auth/weak-password': '密碼強度不足，請使用至少 6 個字符',
        'auth/user-disabled': '此帳號已被停用',
        'auth/user-not-found': '找不到此帳號',
        'auth/wrong-password': '密碼錯誤',
        'auth/too-many-requests': '嘗試次數過多，請稍後再試',
        'auth/network-request-failed': '網路錯誤，請檢查網路連線',
    };

    return errorMessages[code] || '發生未知錯誤，請稍後再試';
};

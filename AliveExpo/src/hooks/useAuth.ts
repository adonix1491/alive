/**
 * useAuth - 認證功能 Hook
 * 封裝用戶認證相關的狀態和操作
 */
import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
    subscribeToAuthState,
    loginWithEmail,
    registerWithEmail,
    logout,
    resetPassword,
    getUserProfile,
} from '../services/firebase';
import { User as AppUser } from '../types';

interface UseAuthResult {
    /** Firebase 用戶 */
    firebaseUser: User | null;
    /** 應用用戶資料 */
    user: AppUser | null;
    /** 是否已認證 */
    isAuthenticated: boolean;
    /** 是否載入中 */
    isLoading: boolean;
    /** 登入 */
    login: (email: string, password: string) => Promise<boolean>;
    /** 註冊 */
    register: (email: string, password: string, name: string) => Promise<boolean>;
    /** 登出 */
    signOut: () => Promise<void>;
    /** 重設密碼 */
    sendPasswordReset: (email: string) => Promise<boolean>;
}

/**
 * 認證功能 Hook
 */
const useAuth = (): UseAuthResult => {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [user, setUser] = useState<AppUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 監聽認證狀態
    useEffect(() => {
        const unsubscribe = subscribeToAuthState(async (fbUser) => {
            setFirebaseUser(fbUser);

            if (fbUser) {
                // 獲取用戶資料
                const result = await getUserProfile(fbUser.uid);
                if (result.success && result.data) {
                    setUser(result.data);
                }
            } else {
                setUser(null);
            }

            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    /**
     * 登入
     */
    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        const result = await loginWithEmail(email, password);
        setIsLoading(false);
        return result.success;
    }, []);

    /**
     * 註冊
     */
    const register = useCallback(
        async (email: string, password: string, name: string): Promise<boolean> => {
            setIsLoading(true);
            const result = await registerWithEmail(email, password, name);
            setIsLoading(false);
            return result.success;
        },
        []
    );

    /**
     * 登出
     */
    const signOut = useCallback(async (): Promise<void> => {
        await logout();
        setUser(null);
        setFirebaseUser(null);
    }, []);

    /**
     * 發送密碼重設郵件
     */
    const sendPasswordReset = useCallback(async (email: string): Promise<boolean> => {
        const result = await resetPassword(email);
        return result.success;
    }, []);

    return {
        firebaseUser,
        user,
        isAuthenticated: !!firebaseUser,
        isLoading,
        login,
        register,
        signOut,
        sendPasswordReset,
    };
};

export default useAuth;

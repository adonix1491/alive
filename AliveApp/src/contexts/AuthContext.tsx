/**
 * 認證 Context
 * 管理全域的登入狀態和使用者資訊
 */
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 檢查登入狀態
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const isAuth = await authService.isAuthenticated();
            if (isAuth) {
                const response = await authService.getMe();
                if (response.data) {
                    setUser(response.data);
                }
            }
        } catch (error) {
            console.error('Check auth error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });
            if (response.data) {
                setUser(response.data.user);
                return { success: true };
            } else {
                return { success: false, error: response.error?.message || '登入失敗' };
            }
        } catch (error: any) {
            return { success: false, error: error.message || '登入失敗' };
        }
    };

    const register = async (email: string, password: string, name: string, phone?: string) => {
        try {
            const response = await authService.register({ email, password, name, phone });
            if (response.data) {
                setUser(response.data.user);
                return { success: true };
            } else {
                return { success: false, error: response.error?.message || '註冊失敗' };
            }
        } catch (error: any) {
            return { success: false, error: error.message || '註冊失敗' };
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const response = await authService.getMe();
            if (response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Refresh user error:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: user !== null,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

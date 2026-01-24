/**
 * useCheckIn - 簽到功能 Hook
 * 封裝簽到相關的狀態和操作
 */
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import checkinService from '../services/api/checkinService';
import { CheckInRecord } from '../types';
import useAuth from './useAuth';

interface UseCheckInResult {
    /** 今日是否已簽到 */
    isCheckedIn: boolean;
    /** 今日簽到記錄 */
    todayCheckIn: CheckInRecord | null;
    /** 最近簽到記錄 */
    recentCheckIns: CheckInRecord[];
    /** 連續簽到天數 */
    streakDays: number;
    /** 是否載入中 */
    isLoading: boolean;
    /** 執行簽到 */
    checkIn: () => Promise<void>;
    /** 刷新資料 */
    refresh: () => Promise<void>;
}

/**
 * 簽到功能 Hook
 */
const useCheckIn = (): UseCheckInResult => {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [todayCheckIn, setTodayCheckIn] = useState<CheckInRecord | null>(null);
    const [recentCheckIns, setRecentCheckIns] = useState<CheckInRecord[]>([]);
    const [streakDays, setStreakDays] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuth();

    /**
     * 載入簽到資料
     */
    const loadCheckInData = useCallback(async () => {
        // 如果沒有 user (未登入), 不進行載入
        if (!user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            // 獲取歷史記錄
            const result = await checkinService.getHistory(20, 0);

            if (result.data) {
                const history = result.data.history;
                setRecentCheckIns(history);

                // 檢查今日是否已簽到
                if (history.length > 0) {
                    const latest = history[0];
                    const checkInDate = new Date(latest.checkedAt);
                    const today = new Date();

                    const isToday = checkInDate.getDate() === today.getDate() &&
                        checkInDate.getMonth() === today.getMonth() &&
                        checkInDate.getFullYear() === today.getFullYear();

                    if (isToday) {
                        setTodayCheckIn(latest);
                        setIsCheckedIn(true);
                    } else {
                        setTodayCheckIn(null);
                        setIsCheckedIn(false);
                    }
                } else {
                    setTodayCheckIn(null);
                    setIsCheckedIn(false);
                }

                // TODO: 實作連續簽到計算 (Mock for now)
                setStreakDays(history.length > 0 ? 1 : 0);
            }
        } catch (error) {
            console.error('載入簽到資料失敗:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    /**
     * 執行簽到
     */
    const checkIn = useCallback(async () => {
        if (isCheckedIn) {
            Alert.alert('提示', '您今天已經簽到了！');
            return;
        }

        setIsLoading(true);

        try {
            // 取得位置 (Mock for now, or use expo-location if configured)
            const result = await checkinService.createCheckIn({
                location: { latitude: 0, longitude: 0 }
            });

            if (result.data) {
                const newCheckIn = result.data.checkIn;
                setTodayCheckIn(newCheckIn);
                setIsCheckedIn(true);
                setStreakDays(prev => prev + 1);
                setRecentCheckIns(prev => [newCheckIn, ...prev]);

                Alert.alert(
                    '簽到成功！✨',
                    '您的平安已記錄，願您今天一切順利！',
                    [{ text: '好的', style: 'default' }]
                );
            } else {
                Alert.alert('簽到失敗', result.error?.message || '請稍後再試');
            }
        } catch (error) {
            console.error('簽到失敗:', error);
            Alert.alert('錯誤', '簽到失敗，請稍後再試');
        } finally {
            setIsLoading(false);
        }
    }, [isCheckedIn]);

    /**
     * 刷新資料
     */
    const refresh = useCallback(async () => {
        await loadCheckInData();
    }, [loadCheckInData]);

    // 初始載入
    useEffect(() => {
        loadCheckInData();
    }, [loadCheckInData]);

    return {
        isCheckedIn,
        todayCheckIn,
        recentCheckIns,
        streakDays,
        isLoading,
        checkIn,
        refresh,
    };
};

export default useCheckIn;

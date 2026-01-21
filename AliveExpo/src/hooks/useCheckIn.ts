/**
 * useCheckIn - 簽到功能 Hook
 * 封裝簽到相關的狀態和操作
 */
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import {
    performCheckIn,
    getTodayCheckIn,
    getRecentCheckIns,
    getStreakDays,
} from '../services/firebase';
import { CheckInRecord } from '../types';

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
 * @param userId 用戶 ID
 */
const useCheckIn = (userId: string | null): UseCheckInResult => {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [todayCheckIn, setTodayCheckIn] = useState<CheckInRecord | null>(null);
    const [recentCheckIns, setRecentCheckIns] = useState<CheckInRecord[]>([]);
    const [streakDays, setStreakDays] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * 載入簽到資料
     */
    const loadCheckInData = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            // 獲取今日簽到
            const todayResult = await getTodayCheckIn(userId);
            if (todayResult.success) {
                setTodayCheckIn(todayResult.data || null);
                setIsCheckedIn(!!todayResult.data);
            }

            // 獲取最近簽到記錄
            const recentResult = await getRecentCheckIns(userId);
            if (recentResult.success && recentResult.data) {
                setRecentCheckIns(recentResult.data);
            }

            // 獲取連續簽到天數
            const streakResult = await getStreakDays(userId);
            if (streakResult.success && streakResult.data !== undefined) {
                setStreakDays(streakResult.data);
            }
        } catch (error) {
            console.error('載入簽到資料失敗:', error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    /**
     * 執行簽到
     */
    const checkIn = useCallback(async () => {
        if (!userId) {
            Alert.alert('錯誤', '請先登入');
            return;
        }

        if (isCheckedIn) {
            Alert.alert('提示', '您今天已經簽到了！');
            return;
        }

        setIsLoading(true);

        try {
            const result = await performCheckIn(userId);

            if (result.success && result.data) {
                setTodayCheckIn(result.data);
                setIsCheckedIn(true);
                setStreakDays(prev => prev + 1);
                setRecentCheckIns(prev => [result.data!, ...prev]);

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
    }, [userId, isCheckedIn]);

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

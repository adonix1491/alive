/**
 * CheckInService - 簽到服務
 * 處理簽到記錄的 CRUD 操作
 */
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import { FIREBASE_COLLECTIONS } from '../../constants';
import { CheckInRecord, ApiResponse } from '../../types';

/**
 * 執行簽到
 * @param userId 用戶 ID
 */
export const performCheckIn = async (
    userId: string
): Promise<ApiResponse<CheckInRecord>> => {
    try {
        const db = getFirebaseDb();
        const checkInRef = doc(collection(db, FIREBASE_COLLECTIONS.CHECK_INS));

        const checkInData: Omit<CheckInRecord, 'id'> = {
            userId,
            timestamp: new Date(),
            status: 'completed',
        };

        await setDoc(checkInRef, {
            ...checkInData,
            timestamp: Timestamp.fromDate(checkInData.timestamp),
        });

        return {
            success: true,
            data: {
                id: checkInRef.id,
                ...checkInData,
            },
        };
    } catch (error: any) {
        console.error('簽到失敗:', error);
        return {
            success: false,
            error: {
                code: 'checkin/failed',
                message: '簽到失敗，請稍後再試',
            },
        };
    }
};

/**
 * 獲取今日簽到記錄
 * @param userId 用戶 ID
 */
export const getTodayCheckIn = async (
    userId: string
): Promise<ApiResponse<CheckInRecord | null>> => {
    try {
        const db = getFirebaseDb();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const checkInsRef = collection(db, FIREBASE_COLLECTIONS.CHECK_INS);
        const q = query(
            checkInsRef,
            where('userId', '==', userId),
            where('timestamp', '>=', Timestamp.fromDate(today)),
            where('timestamp', '<', Timestamp.fromDate(tomorrow)),
            orderBy('timestamp', 'desc'),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { success: true, data: null };
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();

        return {
            success: true,
            data: {
                id: doc.id,
                userId: data.userId,
                timestamp: data.timestamp.toDate(),
                status: data.status,
                location: data.location,
            },
        };
    } catch (error: any) {
        console.error('獲取今日簽到記錄失敗:', error);
        return {
            success: false,
            error: {
                code: 'checkin/fetch-failed',
                message: '獲取簽到記錄失敗',
            },
        };
    }
};

/**
 * 獲取最近的簽到記錄
 * @param userId 用戶 ID
 * @param count 記錄數量
 */
export const getRecentCheckIns = async (
    userId: string,
    count: number = 7
): Promise<ApiResponse<CheckInRecord[]>> => {
    try {
        const db = getFirebaseDb();
        const checkInsRef = collection(db, FIREBASE_COLLECTIONS.CHECK_INS);
        const q = query(
            checkInsRef,
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(count)
        );

        const querySnapshot = await getDocs(q);

        const records: CheckInRecord[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                timestamp: data.timestamp.toDate(),
                status: data.status,
                location: data.location,
            };
        });

        return { success: true, data: records };
    } catch (error: any) {
        console.error('獲取簽到記錄失敗:', error);
        return {
            success: false,
            error: {
                code: 'checkin/fetch-failed',
                message: '獲取簽到記錄失敗',
            },
        };
    }
};

/**
 * 計算連續簽到天數
 * @param userId 用戶 ID
 */
export const getStreakDays = async (
    userId: string
): Promise<ApiResponse<number>> => {
    try {
        const result = await getRecentCheckIns(userId, 30);

        if (!result.success || !result.data) {
            return { success: true, data: 0 };
        }

        const records = result.data;
        if (records.length === 0) {
            return { success: true, data: 0 };
        }

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (const record of records) {
            const recordDate = new Date(record.timestamp);
            recordDate.setHours(0, 0, 0, 0);

            const diffDays = Math.floor(
                (currentDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (diffDays === streak) {
                streak++;
                currentDate = recordDate;
            } else if (diffDays > streak) {
                break;
            }
        }

        return { success: true, data: streak };
    } catch (error: any) {
        console.error('計算連續簽到天數失敗:', error);
        return {
            success: false,
            error: {
                code: 'checkin/streak-failed',
                message: '計算連續簽到天數失敗',
            },
        };
    }
};

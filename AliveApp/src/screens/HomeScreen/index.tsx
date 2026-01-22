/**
 * HomeScreen - 首頁
 * 顯示今日狀態、一鍵簽到按鈕、安全狀態等核心功能
 */
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { CheckInButton, StatusCard, GradientBackground } from '../../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { APP_INFO } from '../../constants';
import { checkinService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 首頁畫面
 * 核心功能：一鍵簽到、顯示安全狀態、緊急聯絡人資訊
 */
const HomeScreen: React.FC = () => {
    const { user } = useAuth();
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [lastCheckInTime, setLastCheckInTime] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * 處理簽到動作
     * 使用真實 API 建立簽到記錄
     */
    const handleCheckIn = useCallback(async () => {
        if (isCheckedIn) {
            Alert.alert('已簽到', '您今天已經完成簽到了！');
            return;
        }

        setIsLoading(true);

        // 呼叫簽到 API
        const response = await checkinService.createCheckIn();

        setIsLoading(false);

        if (response.data) {
            setIsCheckedIn(true);
            setLastCheckInTime(new Date(response.data.checkIn.timestamp));

            Alert.alert(
                '簽到成功！',
                '您的平安已記錄。',
                [{ text: '確定', style: 'default' }]
            );
        } else {
            Alert.alert(
                '簽到失敗',
                response.error?.message || '請稍後再試',
                [{ text: '確定', style: 'cancel' }]
            );
        }
    }, [isCheckedIn]);

    /**
     * 格式化時間顯示
     */
    const formatTime = (date: Date | null): string => {
        if (!date) return '尚未簽到';
        return date.toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    /**
     * 獲取當前日期字串
     */
    const getDateString = (): string => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        };
        return now.toLocaleDateString('zh-TW', options);
    };

    return (
        <GradientBackground variant="light">
            <SafeAreaView style={styles.container}>
                {/* 頂部標題區 */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>今日狀態</Text>
                    <TouchableOpacity style={styles.settingsButton}>
                        <Text style={styles.settingsIcon}>⚙️</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* 日期顯示 */}
                    <Text style={styles.dateText}>{getDateString()}</Text>

                    {/* 簽到狀態提示 */}
                    <Text style={styles.statusHint}>
                        {isCheckedIn
                            ? '今日已簽到，願您平安順心 ✨'
                            : '系統將每日簽到記錄您的平安狀態'}
                    </Text>

                    {/* 核心簽到按鈕 */}
                    <View style={styles.checkInContainer}>
                        <CheckInButton
                            isCheckedIn={isCheckedIn}
                            onPress={handleCheckIn}
                            disabled={isLoading}
                        />
                        {lastCheckInTime && (
                            <Text style={styles.lastCheckInText}>
                                最後簽到：{formatTime(lastCheckInTime)}
                            </Text>
                        )}
                    </View>

                    {/* 標語 */}
                    <View style={styles.sloganContainer}>
                        <Text style={styles.slogan}>{APP_INFO.SLOGAN}</Text>
                        <Text style={styles.sloganEn}>Daily check-in, all is well</Text>
                    </View>

                    {/* 狀態卡片區 */}
                    <View style={styles.cardsContainer}>
                        {/* 安全狀態卡片 */}
                        <StatusCard
                            title="安全狀態"
                            subtitle={isCheckedIn ? '狀態安全' : '待簽到'}
                            variant={isCheckedIn ? 'success' : 'warning'}
                            rightContent={
                                <View style={[
                                    styles.statusBadge,
                                    isCheckedIn ? styles.statusBadgeSuccess : styles.statusBadgeWarning
                                ]}>
                                    <Text style={styles.statusBadgeText}>
                                        {isCheckedIn ? '✓' : '!'}
                                    </Text>
                                </View>
                            }
                            style={styles.card}
                        />

                        {/* 緊急聯絡人卡片 */}
                        <StatusCard
                            title="緊急聯絡人"
                            subtitle="已設置 2 位聯絡人"
                            variant="default"
                            onPress={() => {
                                // TODO: 導航至緊急聯絡人頁面
                                Alert.alert('提示', '前往緊急聯絡人設置');
                            }}
                            rightContent={<Text style={styles.arrowIcon}>›</Text>}
                            style={styles.card}
                        />

                        {/* 最近訊息卡片 */}
                        <StatusCard
                            title="最近推送訊息"
                            subtitle="今天 · 簽到提醒已發送"
                            variant="info"
                            style={styles.card}
                        />
                    </View>
                </ScrollView>

                {/* 底部資訊 */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        多日未簽到，系統將以你的名義，給您設定的緊急聯絡人發送通知
                    </Text>
                    <View style={styles.footerLinks}>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>用戶協議</Text>
                        </TouchableOpacity>
                        <Text style={styles.footerDivider}>和</Text>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>隱私政策</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.md,
    },
    headerTitle: {
        fontSize: FONTS.size.xxl,
        fontWeight: FONTS.bold as any,
        color: COLORS.textPrimary,
    },
    settingsButton: {
        padding: SPACING.sm,
    },
    settingsIcon: {
        fontSize: FONTS.size.xxl,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xxxl,
    },
    dateText: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    statusHint: {
        fontSize: FONTS.size.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xxl,
    },
    checkInContainer: {
        alignItems: 'center',
        marginVertical: SPACING.xxl,
    },
    lastCheckInText: {
        marginTop: SPACING.lg,
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
    },
    sloganContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    slogan: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.medium as any,
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    sloganEn: {
        fontSize: FONTS.size.sm,
        color: COLORS.textLight,
    },
    cardsContainer: {
        gap: SPACING.md,
    },
    card: {
        marginBottom: SPACING.md,
    },
    statusBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusBadgeSuccess: {
        backgroundColor: COLORS.success,
    },
    statusBadgeWarning: {
        backgroundColor: COLORS.warning,
    },
    statusBadgeText: {
        color: COLORS.white,
        fontSize: FONTS.size.md,
        fontWeight: FONTS.bold as any,
    },
    arrowIcon: {
        fontSize: FONTS.size.xxl,
        color: COLORS.textLight,
    },
    footer: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.lg,
        alignItems: 'center',
    },
    footerText: {
        fontSize: FONTS.size.xs,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    footerLinks: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerLink: {
        fontSize: FONTS.size.xs,
        color: COLORS.primary,
    },
    footerDivider: {
        fontSize: FONTS.size.xs,
        color: COLORS.textLight,
        marginHorizontal: SPACING.xs,
    },
});

export default HomeScreen;

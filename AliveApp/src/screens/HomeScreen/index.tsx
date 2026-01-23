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
    TextInput,
} from 'react-native';
import { CheckInButton, StatusCard, GradientBackground } from '../../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { APP_INFO } from '../../constants';
import { checkinService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

/**
 * 首頁畫面
 * 核心功能：一鍵簽到、顯示安全狀態、緊急聯絡人資訊
 */
const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user, guestLogin } = useAuth();
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [lastCheckInTime, setLastCheckInTime] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [guestPhone, setGuestPhone] = useState('');
    const [guestName, setGuestName] = useState('');
    const [debugToken, setDebugToken] = useState<string | null>(null);

    React.useEffect(() => {
        checkinService.getToken().then(t => setDebugToken(t));
    }, [user]);

    /**
     * 檢查個人資料完整性
     * 簽到前必須確保用戶已綁定至少一種聯絡方式
     * return true = 通過檢查, false = 不通過
     */
    const checkProfileCompletion = useCallback(() => {
        // 1. 訪客檢查 (未登入)
        // 1. 訪客檢查 (未登入)
        if (!user) {
            Alert.alert(
                '請先啟用訪客模式',
                '請在上方輸入手機號碼以啟用簽到功能。',
                [
                    { text: '好', style: 'default' }
                ]
            );
            return false;
        }

        // 2. 資料綁定檢查 (手機 或 Email 或 LINE ID)
        // 確保至少有一種聯絡方式
        const hasContactMethod = !!user.email || !!user.phoneNumber || !!user.lineId;

        // DEBUG: 打印檢查結果
        console.log('Profile Check:', {
            email: !!user.email,
            phone: !!user.phoneNumber,
            line: !!user.lineId,
            result: hasContactMethod
        });

        if (!hasContactMethod) {
            Alert.alert(
                '需要綁定資料',
                `為了能夠完成簽到，請至少綁定一種聯絡方式：\n1. 手機號碼 ${user.phoneNumber ? '(已綁定)' : '(未綁定)'}\n2. Email ${user.email ? '(已綁定)' : '(未綁定)'}\n3. LINE ID ${user.lineId ? '(已綁定)' : '(未綁定)'}`,
                [
                    { text: '稍後再說', style: 'cancel' },
                    {
                        text: '前往設定頁',
                        onPress: () => navigation.navigate('Profile')
                    }
                ]
            );
            return false;
        }

        return true;
    }, [user, navigation]);

    /**
     * 處理簽到動作
     * 使用真實 API 建立簽到記錄
     */
    const handleCheckIn = useCallback(async () => {
        // 先檢查資料完整性
        if (!checkProfileCompletion()) {
            return;
        }

        if (isCheckedIn) {
            Alert.alert('已簽到', '您今天已經完成簽到了！');
            return;
        }

        setIsLoading(true);

        try {
            // 呼叫簽到 API
            const response = await checkinService.createCheckIn();

            if (response.data) {
                setIsCheckedIn(true);
                setLastCheckInTime(new Date(response.data.checkIn.timestamp));

                Alert.alert(
                    '簽到成功！',
                    '您的平安已記錄。',
                    [{ text: '確定', style: 'default' }]
                );
            } else {
                // 處理 403 資料不全錯誤
                if (response.error?.code === 'PROFILE_INCOMPLETE') {
                    Alert.alert(
                        '資料未完善 (伺服器回應)',
                        '簽到前請至少綁定一項聯絡方式 (手機、Email 或 LINE)，以確保緊急時刻能通知到您。',
                        [
                            { text: '稍後再說', style: 'cancel' },
                            {
                                text: '前往綁定',
                                onPress: () => navigation.navigate('Profile') // 或跳轉到 Profile 編輯 Modal
                            }
                        ]
                    );
                } else {
                    Alert.alert(
                        '簽到失敗',
                        `錯誤代碼: ${response.error?.code}\n訊息: ${response.error?.message}`,
                        [{ text: '確定', style: 'cancel' }]
                    );
                }
            }
        } catch (err: any) {
            Alert.alert('發生例外錯誤', err.message);
        } finally {
            setIsLoading(false);
        }
    }, [isCheckedIn, checkProfileCompletion]);

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

    const handleGuestLogin = async () => {
        if (!guestPhone) {
            Alert.alert('提示', '請輸入手機號碼');
            return;
        }
        if (guestPhone.length < 8) {
            Alert.alert('提示', '請輸入有效的手機號碼');
            return;
        }

        setIsLoading(true);
        try {
            const result = await guestLogin(guestPhone, guestName);
            if (result.success) {
                Alert.alert('歡迎', '訪客模式已啟用，您現在可以進行簽到了！');
                setGuestPhone('');
                setGuestName('');
            } else {
                Alert.alert('登入失敗', result.error);
            }
        } catch (error) {
            Alert.alert('錯誤', '發生未預期的錯誤');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GradientBackground variant="light">
            <SafeAreaView style={styles.container}>
                {/* 頂部標題區 */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>今日狀態</Text>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => navigation.navigate('Profile')}
                    >
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

                        {/* 訪客登入 或 緊急聯絡人卡片 */}
                        {!user ? (
                            <View style={styles.guestFormCard}>
                                <Text style={styles.guestFormTitle}>訪客快速簽到</Text>
                                <Text style={styles.guestFormSubtitle}>輸入手機號碼即可啟用簽到功能</Text>
                                <TextInput
                                    style={styles.guestInput}
                                    placeholder="您的手機號碼"
                                    placeholderTextColor={COLORS.textLight}
                                    value={guestPhone}
                                    onChangeText={setGuestPhone}
                                    keyboardType="phone-pad"
                                />
                                <TextInput
                                    style={styles.guestInput}
                                    placeholder="您的暱稱 (選填)"
                                    placeholderTextColor={COLORS.textLight}
                                    value={guestName}
                                    onChangeText={setGuestName}
                                />
                                <TouchableOpacity
                                    style={styles.guestButton}
                                    onPress={handleGuestLogin}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.guestButtonText}>啟用訪客模式</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <StatusCard
                                title="緊急聯絡人"
                                subtitle="管理聯絡人"
                                icon="alert-circle"
                                variant="danger"
                                onPress={() => navigation.navigate('Profile')}
                                rightContent={<Text style={styles.arrowIcon}>›</Text>}
                                style={styles.card}
                            />
                        )}

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
                    <Text style={styles.footerCopyright}>
                        © 2026 ALIVE. All rights reserved. (Build: 2026.01.22-DebugMode)
                    </Text>
                    {/* Debug Info Overlay */}
                    <View style={{ marginTop: 20, padding: 10, backgroundColor: '#eee', borderRadius: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>DEBUG INFO</Text>
                        <Text style={{ fontSize: 10, fontFamily: 'monospace' }}>
                            UID: {user?.id || 'null'} | Name: {user?.name || 'null'}
                        </Text>
                        <Text style={{ fontSize: 10, fontFamily: 'monospace' }}>
                            Email: {user?.email ? 'YES' : 'NO'} | Phone: {user?.phoneNumber ? 'YES' : 'NO'} | Line: {user?.lineId ? 'YES' : 'NO'}
                        </Text>
                        <Text style={{ fontSize: 10, fontFamily: 'monospace' }}>
                            CheckIn: {isCheckedIn ? 'TRUE' : 'FALSE'} | Token: {debugToken ? 'YES' : 'NO'}
                        </Text>
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
    footerCopyright: {
        fontSize: FONTS.size.xs,
        color: COLORS.textLight,
        marginTop: SPACING.xs,
        fontWeight: 'bold',
    },
    guestFormCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.md,
    },
    guestFormTitle: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.bold as any,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    guestFormSubtitle: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    guestInput: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        fontSize: FONTS.size.md,
        borderWidth: 1,
        borderColor: COLORS.gray300,
        color: COLORS.textPrimary,
    },
    guestButton: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    guestButtonText: {
        color: COLORS.white,
        fontWeight: FONTS.bold as any,
        fontSize: FONTS.size.md,
    },
});

export default HomeScreen;

/**
 * NotificationSettingsScreen - 通知設定頁面
 * 管理各通知渠道的綁定與設定
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    TextInput,
    Modal,
    Alert,
    Linking,
} from 'react-native';
import { GradientBackground } from '../../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { NotificationChannel } from '../../types';
import { NOTIFICATION_CHANNELS } from '../../constants';

interface ChannelConfig {
    id: NotificationChannel;
    name: string;
    icon: string;
    description: string;
    enabled: boolean;
    verified: boolean;
    value?: string;
}

/**
 * 通知設定頁面
 */
const NotificationSettingsScreen: React.FC = () => {
    const [channels, setChannels] = useState<ChannelConfig[]>([
        {
            id: 'push',
            name: NOTIFICATION_CHANNELS.PUSH.name,
            icon: '🔔',
            description: NOTIFICATION_CHANNELS.PUSH.description,
            enabled: true,
            verified: true,
        },
        {
            id: 'email',
            name: NOTIFICATION_CHANNELS.EMAIL.name,
            icon: '📧',
            description: NOTIFICATION_CHANNELS.EMAIL.description,
            enabled: false,
            verified: false,
            value: '',
        },
        {
            id: 'line',
            name: NOTIFICATION_CHANNELS.LINE.name,
            icon: '💚',
            description: NOTIFICATION_CHANNELS.LINE.description,
            enabled: false,
            verified: false,
        },
        {
            id: 'sms',
            name: NOTIFICATION_CHANNELS.SMS.name,
            icon: '💬',
            description: NOTIFICATION_CHANNELS.SMS.description,
            enabled: false,
            verified: false,
            value: '',
        },
    ]);

    const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
    const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [phoneInput, setPhoneInput] = useState('');

    /**
     * 切換通知渠道
     */
    const toggleChannel = (channelId: NotificationChannel) => {
        const channel = channels.find(c => c.id === channelId);

        if (!channel) return;

        // 如果渠道未驗證，需要先進行設定
        if (!channel.verified && !channel.enabled) {
            switch (channelId) {
                case 'email':
                    setIsEmailModalVisible(true);
                    return;
                case 'sms':
                    setIsPhoneModalVisible(true);
                    return;
                case 'line':
                    handleLineConnect();
                    return;
                default:
                    break;
            }
        }

        // 更新狀態
        setChannels(prev =>
            prev.map(c =>
                c.id === channelId ? { ...c, enabled: !c.enabled } : c
            )
        );
    };

    /**
     * 處理 LINE 連接
     */
    const handleLineConnect = async () => {
        Alert.alert(
            '連接 LINE Notify',
            '將開啟 LINE 授權頁面，完成後即可接收通知。',
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '前往連接',
                    onPress: async () => {
                        // TODO: 實作 LINE Notify OAuth
                        // 模擬成功連接
                        setChannels(prev =>
                            prev.map(c =>
                                c.id === 'line' ? { ...c, enabled: true, verified: true } : c
                            )
                        );
                        Alert.alert('成功', 'LINE Notify 已連接');
                    },
                },
            ]
        );
    };

    /**
     * 儲存 Email 設定
     */
    const handleSaveEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
            Alert.alert('錯誤', '請輸入有效的電子郵箱地址');
            return;
        }

        setChannels(prev =>
            prev.map(c =>
                c.id === 'email'
                    ? { ...c, value: emailInput, verified: true, enabled: true }
                    : c
            )
        );
        setIsEmailModalVisible(false);
        Alert.alert('成功', '電子郵箱已設定，驗證郵件已發送');
    };

    /**
     * 儲存電話設定
     */
    const handleSavePhone = () => {
        const phoneRegex = /^09\d{8}$/;
        if (!phoneRegex.test(phoneInput)) {
            Alert.alert('錯誤', '請輸入有效的手機號碼（09XXXXXXXX）');
            return;
        }

        setChannels(prev =>
            prev.map(c =>
                c.id === 'sms'
                    ? { ...c, value: phoneInput, verified: true, enabled: true }
                    : c
            )
        );
        setIsPhoneModalVisible(false);
        Alert.alert('成功', '簡訊通知已設定');
    };

    /**
     * 取消綁定
     */
    const handleDisconnect = (channelId: NotificationChannel) => {
        Alert.alert(
            '確認取消綁定',
            '取消綁定後將無法透過此渠道接收通知，確定要繼續嗎？',
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '確定',
                    style: 'destructive',
                    onPress: () => {
                        setChannels(prev =>
                            prev.map(c =>
                                c.id === channelId
                                    ? { ...c, enabled: false, verified: false, value: '' }
                                    : c
                            )
                        );
                    },
                },
            ]
        );
    };

    /**
     * 遮蔽顯示敏感資訊
     */
    const maskValue = (value: string, type: 'email' | 'phone'): string => {
        if (!value) return '';
        if (type === 'email') {
            const [name, domain] = value.split('@');
            if (name.length <= 3) return `${name[0]}***@${domain}`;
            return `${name.slice(0, 3)}***@${domain}`;
        }
        return value.replace(/(\d{4})(\d{3})(\d{3})/, '$1****$3');
    };

    /**
     * 渲染通知渠道卡片
     */
    const renderChannelCard = (channel: ChannelConfig) => (
        <View key={channel.id} style={styles.channelCard}>
            <View style={styles.channelHeader}>
                <Text style={styles.channelIcon}>{channel.icon}</Text>
                <View style={styles.channelInfo}>
                    <View style={styles.channelTitleRow}>
                        <Text style={styles.channelName}>{channel.name}</Text>
                        {channel.verified && (
                            <View style={styles.verifiedBadge}>
                                <Text style={styles.verifiedText}>已驗證</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.channelDesc}>{channel.description}</Text>
                    {channel.value && (
                        <Text style={styles.channelValue}>
                            {maskValue(channel.value, channel.id === 'email' ? 'email' : 'phone')}
                        </Text>
                    )}
                </View>
                <Switch
                    value={channel.enabled}
                    onValueChange={() => toggleChannel(channel.id)}
                    trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
                    thumbColor={channel.enabled ? COLORS.primary : COLORS.gray400}
                />
            </View>

            {channel.verified && channel.id !== 'push' && (
                <TouchableOpacity
                    style={styles.disconnectButton}
                    onPress={() => handleDisconnect(channel.id)}
                >
                    <Text style={styles.disconnectText}>取消綁定</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <GradientBackground variant="light">
            <SafeAreaView style={styles.container}>
                {/* 頂部導航 */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>通知設定</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* 說明 */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        選擇您希望接收通知的渠道。當緊急聯絡人需要被通知時，系統將透過這些渠道發送訊息。
                    </Text>
                </View>

                {/* 渠道列表 */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {channels.map(renderChannelCard)}

                    {/* 注意事項 */}
                    <View style={styles.noticeContainer}>
                        <Text style={styles.noticeTitle}>📌 注意事項</Text>
                        <Text style={styles.noticeText}>
                            • 建議至少啟用兩種通知渠道以確保訊息送達
                        </Text>
                        <Text style={styles.noticeText}>
                            • LINE Notify 每月有發送數量限制
                        </Text>
                        <Text style={styles.noticeText}>
                            • 簡訊通知可能產生額外費用
                        </Text>
                    </View>
                </ScrollView>

                {/* Email 設定 Modal */}
                <Modal
                    visible={isEmailModalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setIsEmailModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>設定電子郵箱</Text>
                            <Text style={styles.modalDesc}>
                                請輸入用於接收通知的電子郵箱地址
                            </Text>
                            <TextInput
                                style={styles.modalInput}
                                value={emailInput}
                                onChangeText={setEmailInput}
                                placeholder="example@email.com"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsEmailModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={handleSaveEmail}
                                >
                                    <Text style={styles.confirmButtonText}>確認</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* 電話設定 Modal */}
                <Modal
                    visible={isPhoneModalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setIsPhoneModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>設定手機號碼</Text>
                            <Text style={styles.modalDesc}>
                                請輸入用於接收簡訊通知的手機號碼
                            </Text>
                            <TextInput
                                style={styles.modalInput}
                                value={phoneInput}
                                onChangeText={setPhoneInput}
                                placeholder="0912345678"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsPhoneModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={handleSavePhone}
                                >
                                    <Text style={styles.confirmButtonText}>確認</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
    backButton: {
        padding: SPACING.sm,
    },
    backIcon: {
        fontSize: FONTS.size.xxl,
        color: COLORS.textPrimary,
    },
    headerTitle: {
        fontSize: FONTS.size.xl,
        fontWeight: FONTS.bold as any,
        color: COLORS.textPrimary,
    },
    placeholder: {
        width: 40,
    },
    infoContainer: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
    },
    infoText: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        lineHeight: FONTS.size.sm * 1.5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xxxl,
    },
    channelCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    channelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    channelIcon: {
        fontSize: 28,
        marginRight: SPACING.md,
    },
    channelInfo: {
        flex: 1,
    },
    channelTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    channelName: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.semiBold as any,
        color: COLORS.textPrimary,
        marginRight: SPACING.sm,
    },
    verifiedBadge: {
        backgroundColor: COLORS.success,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: RADIUS.sm,
    },
    verifiedText: {
        fontSize: FONTS.size.xs,
        color: COLORS.white,
    },
    channelDesc: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    channelValue: {
        fontSize: FONTS.size.sm,
        color: COLORS.primary,
        marginTop: SPACING.xs,
    },
    disconnectButton: {
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray200,
        alignItems: 'center',
    },
    disconnectText: {
        fontSize: FONTS.size.sm,
        color: COLORS.danger,
    },
    noticeContainer: {
        backgroundColor: COLORS.gray100,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginTop: SPACING.lg,
    },
    noticeTitle: {
        fontSize: FONTS.size.md,
        fontWeight: FONTS.semiBold as any,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    noticeText: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        lineHeight: FONTS.size.sm * 1.5,
    },
    // Modal 樣式
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        padding: SPACING.xl,
        width: '100%',
    },
    modalTitle: {
        fontSize: FONTS.size.xl,
        fontWeight: FONTS.bold as any,
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    modalDesc: {
        fontSize: FONTS.size.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: COLORS.gray300,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        fontSize: FONTS.size.lg,
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: SPACING.xl,
        gap: SPACING.md,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.gray300,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: FONTS.size.md,
        color: COLORS.textSecondary,
    },
    confirmButton: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: FONTS.size.md,
        color: COLORS.white,
        fontWeight: FONTS.semiBold as any,
    },
});

export default NotificationSettingsScreen;

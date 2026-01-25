/**
 * ProfileScreen - 個人中心頁面
 * 用戶資料管理與帳號設定
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Alert,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { GradientBackground } from '../../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { APP_INFO } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';

interface MenuItem {
    id: string;
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
    danger?: boolean;
}

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

/**
 * 個人中心頁面
 */
const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user, logout, refreshUser, guestLogin } = useAuth();

    // 編輯模式狀態
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editLineId, setEditLineId] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // 訪客登入 State
    const [guestPhone, setGuestPhone] = useState('');
    const [guestName, setGuestName] = useState('');
    const [isGuestLoading, setIsGuestLoading] = useState(false);

    // 初始化編輯資料
    const openEditModal = () => {
        setEditName(user?.name || '');
        setEditPhone(user?.phoneNumber || '');
        setEditLineId(user?.lineId || '');
        setIsEditModalVisible(true);
    };

    /**
     * 儲存個人資料
     */
    const handleSaveProfile = async () => {
        if (!editName) {
            Alert.alert('錯誤', '姓名不能為空');
            return;
        }

        setIsUpdating(true);
        try {
            const response = await authService.updateProfile({
                name: editName,
                phoneNumber: editPhone,
                lineId: editLineId,
            });

            if (response.data) {
                // 重新獲取用戶資料以更新 Context
                await refreshUser();
                Alert.alert('成功', '個人資料已更新');
                setIsEditModalVisible(false);
            } else {
                Alert.alert('失敗', response.error?.message || '更新失敗');
            }
        } catch (error: any) {
            Alert.alert('錯誤', error.message || '更新發生錯誤');
        } finally {
            setIsUpdating(false);
        }
    };

    /**
     * 處理登出
     */
    const handleLogout = () => {
        Alert.alert(
            '確認登出',
            '確定要登出嗎？',
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '登出',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        // 登出後會自動導航到登入頁面（由 AuthContext 處理）
                    },
                },
            ]
        );
    };

    /**
     * 功能選單項目
     */
    const menuItems: MenuItem[][] = [
        // 帳號設定
        [
            {
                id: 'edit_profile',
                icon: '👤',
                title: '編輯個人資料',
                onPress: openEditModal,
                showArrow: true,
            },
            {
                id: 'change_password',
                icon: '🔐',
                title: '修改密碼',
                onPress: () => Alert.alert('提示', '前往修改密碼'),
                showArrow: true,
            },
        ],
        // ... (其他選單項目保持不變) ...
        // 通知設定
        [
            {
                id: 'notification',
                icon: '🔔',
                title: '通知設定',
                subtitle: '管理通知渠道',
                onPress: () => Alert.alert('提示', '前往通知設定'),
                showArrow: true,
            },
            {
                id: 'message_templates',
                icon: '💬',
                title: '訊息模板',
                subtitle: '自訂通知訊息',
                onPress: () => navigation.navigate('MessageTemplates'),
                showArrow: true,
            },
            {
                id: 'anomaly_rules',
                icon: '⚠️',
                title: '異常規則',
                subtitle: '設定觸發條件',
                onPress: () => Alert.alert('提示', '前往異常規則'),
                showArrow: true,
            },
        ],
        // 其他
        [
            {
                id: 'privacy',
                icon: '🔒',
                title: '隱私設定',
                onPress: () => Alert.alert('提示', '前往隱私設定'),
                showArrow: true,
            },
            {
                id: 'help',
                icon: '❓',
                title: '幫助中心',
                onPress: () => Alert.alert('提示', '前往幫助中心'),
                showArrow: true,
            },
            {
                id: 'about',
                icon: 'ℹ️',
                title: '關於我們',
                subtitle: `版本 ${APP_INFO.VERSION}`,
                onPress: () => Alert.alert('提示', '前往關於我們'),
                showArrow: true,
            },
        ],
        // 危險操作
        [
            {
                id: 'logout',
                icon: '🚪',
                title: '登出',
                onPress: handleLogout,
                danger: true,
            },
        ],
    ];

    /**
     * 渲染選單項目
     */
    const renderMenuItem = (item: MenuItem) => (
        <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
        >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, item.danger && styles.menuTitleDanger]}>
                    {item.title}
                </Text>
                {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                )}
            </View>
            {item.showArrow && <Text style={styles.menuArrow}>›</Text>}
        </TouchableOpacity>
    );

    /**
     * 渲染選單組
     */
    const renderMenuGroup = (items: MenuItem[], index: number) => (
        <View key={index} style={styles.menuGroup}>
            {items.map((item, itemIndex) => (
                <React.Fragment key={item.id}>
                    {renderMenuItem(item)}
                    {itemIndex < items.length - 1 && <View style={styles.menuDivider} />}
                </React.Fragment>
            ))}
        </View>
    );

    return (
        <GradientBackground variant="light">
            <SafeAreaView style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* 用戶資料卡片 */}
                    <View style={styles.profileCard}>
                        {user ? (
                            <>
                                <View style={styles.avatarContainer}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>
                                            {user.name?.charAt(0) || '?'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={styles.editAvatarButton} onPress={openEditModal}>
                                        <Text style={styles.editAvatarIcon}>✏️</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.userName}>{user.name}</Text>
                                <Text style={styles.userEmail}>{user.email}</Text>
                                {user.phoneNumber && (
                                    <Text style={styles.userPhone}>{user.phoneNumber}</Text>
                                )}
                                {user.lineId && (
                                    <Text style={[styles.userPhone, { color: COLORS.success }]}>LINE: {user.lineId}</Text>
                                )}

                                {/* 統計數據 */}
                                <View style={styles.statsContainer}>
                                    {/* 這裡需要真實數據，暫時使用模擬數據或 user 物件中的屬性如果有的話 */}
                                    <View style={styles.statItem}>
                                        <Text style={styles.statValue}>-</Text>
                                        <Text style={styles.statLabel}>連續簽到</Text>
                                    </View>
                                    <View style={styles.statDivider} />
                                    <View style={styles.statItem}>
                                        <Text style={styles.statValue}>-</Text>
                                        <Text style={styles.statLabel}>總簽到數</Text>
                                    </View>
                                </View>
                            </>
                        ) : (
                            <View style={styles.notLoginContainer}>
                                <Text style={styles.notLoginText}>綁定個人資料</Text>
                                <Text style={styles.guestFormSubtitle}>
                                    為了確保在緊急時刻能通知到您，請綁定至少一項聯絡資訊。
                                </Text>

                                <View style={styles.guestFormContainer}>
                                    <Text style={styles.inputLabel}>手機號碼 (必填)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="例：0912345678"
                                        placeholderTextColor={COLORS.textLight}
                                        value={guestPhone}
                                        onChangeText={setGuestPhone}
                                        keyboardType="phone-pad"
                                    />

                                    <Text style={styles.inputLabel}>您的稱呼 (選填)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="例：陳先生/小姐"
                                        placeholderTextColor={COLORS.textLight}
                                        value={guestName}
                                        onChangeText={setGuestName}
                                    />

                                    <TouchableOpacity
                                        style={styles.loginButton}
                                        onPress={async () => {
                                            if (!guestPhone) {
                                                Alert.alert('提示', '請輸入手機號碼');
                                                return;
                                            }
                                            setIsGuestLoading(true);
                                            try {
                                                const result = await guestLogin(guestPhone, guestName);
                                                if (!result.success) {
                                                    Alert.alert('綁定失敗', result.error);
                                                } else {
                                                    Alert.alert('綁定成功', '您現在可以使用簽到功能了！');
                                                    setGuestPhone('');
                                                    setGuestName('');
                                                }
                                            } catch (err) {
                                                Alert.alert('錯誤', '發生未預期的錯誤');
                                            } finally {
                                                setIsGuestLoading(false);
                                            }
                                        }}
                                        disabled={isGuestLoading}
                                    >
                                        {isGuestLoading ? (
                                            <ActivityIndicator color={COLORS.white} />
                                        ) : (
                                            <Text style={styles.loginButtonText}>確認綁定</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* 功能選單 */}
                    {user && menuItems.map((group, index) => renderMenuGroup(group, index))}

                    {/* 版權資訊 */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            {APP_INFO.NAME} v{APP_INFO.VERSION}
                        </Text>
                        <Text style={styles.footerCopyright}>
                            © 2026 ALIVE. All rights reserved.
                        </Text>
                    </View>
                </ScrollView>

                {/* 編輯個人資料 Modal */}
                {isEditModalVisible && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>編輯個人資料</Text>

                            <Text style={styles.inputLabel}>姓名</Text>
                            <TextInput
                                style={styles.input}
                                value={editName}
                                onChangeText={setEditName}
                                placeholder="請輸入姓名"
                            />

                            <TextInput
                                style={styles.input}
                                value={editPhone}
                                onChangeText={setEditPhone}
                                placeholder="請輸入電話號碼"
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.inputLabel}>LINE ID</Text>
                            <TextInput
                                style={styles.input}
                                value={editLineId}
                                onChangeText={setEditLineId}
                                placeholder="請輸入 LINE ID (選填)"
                                autoCapitalize="none"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setIsEditModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.saveButton]}
                                    onPress={handleSaveProfile}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <ActivityIndicator color={COLORS.white} />
                                    ) : (
                                        <Text style={styles.saveButtonText}>儲存</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.xxxl,
    },
    profileCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.xl,
        ...SHADOWS.md,
    },
    notLoginContainer: {
        alignItems: 'center',
        padding: SPACING.lg,
    },
    notLoginText: {
        fontSize: FONTS.size.lg,
        color: COLORS.textSecondary,
        marginBottom: SPACING.lg,
    },
    loginButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.lg,
    },
    loginButtonText: {
        color: COLORS.white,
        fontSize: FONTS.size.md,
        fontWeight: FONTS.semiBold as any,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: FONTS.bold as any,
        color: COLORS.white,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.sm,
    },
    editAvatarIcon: {
        fontSize: 14,
    },
    userName: {
        fontSize: FONTS.size.xxl,
        fontWeight: FONTS.bold as any,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    userEmail: {
        fontSize: FONTS.size.md,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    userPhone: {
        fontSize: FONTS.size.md,
        color: COLORS.textSecondary,
        marginBottom: SPACING.lg,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray200,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: FONTS.size.title,
        fontWeight: FONTS.bold as any,
        color: COLORS.primary,
    },
    statLabel: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: COLORS.gray200,
    },
    menuGroup: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        ...SHADOWS.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    menuIcon: {
        fontSize: 22,
        marginRight: SPACING.md,
        width: 28,
        textAlign: 'center',
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: FONTS.size.md,
        fontWeight: FONTS.medium as any,
        color: COLORS.textPrimary,
    },
    menuTitleDanger: {
        color: COLORS.danger,
    },
    menuSubtitle: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    menuArrow: {
        fontSize: FONTS.size.xxl,
        color: COLORS.textLight,
    },
    menuDivider: {
        height: 1,
        backgroundColor: COLORS.gray100,
        marginLeft: SPACING.lg + 28 + SPACING.md,
    },
    footer: {
        alignItems: 'center',
        paddingTop: SPACING.xl,
    },
    footerText: {
        fontSize: FONTS.size.sm,
        color: COLORS.textLight,
    },
    footerCopyright: {
        fontSize: FONTS.size.xs,
        color: COLORS.textLight,
        marginTop: SPACING.xs,
    },

    // Modal Styles
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
        zIndex: 1000,
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.xl,
        width: '100%',
        maxWidth: 400,
        ...SHADOWS.lg,
    },
    modalTitle: {
        fontSize: FONTS.size.xl,
        fontWeight: FONTS.bold as any,
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        marginTop: SPACING.md,
    },
    input: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.gray200,
        fontSize: FONTS.size.md,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.xl,
        gap: SPACING.md,
    },
    modalButton: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.gray100,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
    cancelButtonText: {
        color: COLORS.textPrimary,
        fontWeight: FONTS.medium as any,
    },
    saveButtonText: {
        color: COLORS.white,
        fontWeight: FONTS.bold as any,
    },
    guestFormSubtitle: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
        textAlign: 'center',
        paddingHorizontal: SPACING.sm,
    },
    guestFormContainer: {
        width: '100%',
        marginTop: SPACING.md,
    },
});

export default ProfileScreen;

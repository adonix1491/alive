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
} from 'react-native';
import { GradientBackground } from '../../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { APP_INFO } from '../../constants';

interface MenuItem {
    id: string;
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
    danger?: boolean;
}

/**
 * 個人中心頁面
 */
const ProfileScreen: React.FC = () => {
    // 模擬用戶資料
    const [user] = useState({
        name: '王小明',
        email: 'xiaoming@example.com',
        phone: '0912****678',
        checkInStreak: 15,
        totalCheckIns: 45,
    });

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
                    onPress: () => {
                        // TODO: 實作登出邏輯
                        Alert.alert('提示', '已登出');
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
                onPress: () => Alert.alert('提示', '前往編輯個人資料'),
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
                onPress: () => Alert.alert('提示', '前往訊息模板'),
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
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {user.name.charAt(0)}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.editAvatarButton}>
                                <Text style={styles.editAvatarIcon}>📷</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>

                        {/* 統計數據 */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{user.checkInStreak}</Text>
                                <Text style={styles.statLabel}>連續簽到</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{user.totalCheckIns}</Text>
                                <Text style={styles.statLabel}>總簽到數</Text>
                            </View>
                        </View>
                    </View>

                    {/* 功能選單 */}
                    {menuItems.map((group, index) => renderMenuGroup(group, index))}

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
});

export default ProfileScreen;

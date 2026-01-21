/**
 * EmergencyContactsScreen - 緊急聯絡人管理頁面
 * 管理緊急聯絡人清單，支援新增、編輯、刪除
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { GradientBackground } from '../../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { EmergencyContact } from '../../types';

// 模擬資料
const MOCK_CONTACTS: EmergencyContact[] = [
    {
        id: '1',
        userId: 'user1',
        name: '媽媽',
        phone: '0912345678',
        email: 'mom@example.com',
        priority: 1,
        isEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        userId: 'user1',
        name: '爸爸',
        phone: '0923456789',
        priority: 2,
        isEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

/**
 * 緊急聯絡人管理頁面
 */
const EmergencyContactsScreen: React.FC = () => {
    const [contacts, setContacts] = useState<EmergencyContact[]>(MOCK_CONTACTS);

    /**
     * 切換聯絡人啟用狀態
     */
    const toggleContactEnabled = (id: string) => {
        setContacts(prev =>
            prev.map(contact =>
                contact.id === id
                    ? { ...contact, isEnabled: !contact.isEnabled }
                    : contact
            )
        );
    };

    /**
     * 刪除聯絡人
     */
    const handleDeleteContact = (id: string) => {
        Alert.alert(
            '確認刪除',
            '確定要刪除此緊急聯絡人嗎？',
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '刪除',
                    style: 'destructive',
                    onPress: () => {
                        setContacts(prev => prev.filter(c => c.id !== id));
                    },
                },
            ]
        );
    };

    /**
     * 渲染聯絡人項目
     */
    const renderContactItem = ({ item }: { item: EmergencyContact }) => (
        <View style={styles.contactCard}>
            <View style={styles.contactInfo}>
                <View style={styles.contactIcon}>
                    <Text style={styles.contactIconText}>
                        {item.name.charAt(0)}
                    </Text>
                </View>
                <View style={styles.contactDetails}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactPhone}>{item.phone}</Text>
                    {!item.isEnabled && (
                        <Text style={styles.disabledLabel}>已停用</Text>
                    )}
                </View>
            </View>
            <View style={styles.contactActions}>
                <Switch
                    value={item.isEnabled}
                    onValueChange={() => toggleContactEnabled(item.id)}
                    trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
                    thumbColor={item.isEnabled ? COLORS.primary : COLORS.gray400}
                />
            </View>
        </View>
    );

    return (
        <GradientBackground variant="primary">
            <SafeAreaView style={styles.container}>
                {/* 頂部導航 */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>異常清單</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addIcon}>＋</Text>
                    </TouchableOpacity>
                </View>

                {/* 聯絡人列表 */}
                <FlatList
                    data={contacts}
                    renderItem={renderContactItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>尚未設定緊急聯絡人</Text>
                            <Text style={styles.emptyHint}>
                                點擊右上角 ＋ 添加聯絡人
                            </Text>
                        </View>
                    }
                />
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
        paddingBottom: SPACING.xl,
    },
    backButton: {
        padding: SPACING.sm,
    },
    backIcon: {
        fontSize: FONTS.size.xxl,
        color: COLORS.white,
    },
    headerTitle: {
        fontSize: FONTS.size.xl,
        fontWeight: FONTS.bold as any,
        color: COLORS.white,
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.warning,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addIcon: {
        fontSize: FONTS.size.xl,
        color: COLORS.black,
        fontWeight: FONTS.bold as any,
    },
    listContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xxxl,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.cardBackground,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    contactIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    contactIconText: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.bold as any,
        color: COLORS.white,
    },
    contactDetails: {
        flex: 1,
    },
    contactName: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.semiBold as any,
        color: COLORS.textPrimary,
    },
    contactPhone: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    disabledLabel: {
        fontSize: FONTS.size.xs,
        color: COLORS.danger,
        marginTop: SPACING.xs,
    },
    contactActions: {
        marginLeft: SPACING.md,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: SPACING.huge,
    },
    emptyText: {
        fontSize: FONTS.size.lg,
        color: COLORS.white,
        marginBottom: SPACING.sm,
    },
    emptyHint: {
        fontSize: FONTS.size.md,
        color: COLORS.gray300,
    },
});

export default EmergencyContactsScreen;

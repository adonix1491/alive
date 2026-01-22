/**
 * EmergencyContactsScreen - 緊急聯絡人管理頁面
 * 管理緊急聯絡人清單，支援新增、編輯、刪除
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    Alert,
    TextInput,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { GradientBackground } from '../../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { contactsService } from '../../services/api';
import { EmergencyContact } from '../../services/api/contactsService';
import { useNavigation } from '@react-navigation/native';

/**
 * 緊急聯絡人管理頁面
 */
const EmergencyContactsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Modal 狀態
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
    const [formName, setFormName] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formLineId, setFormLineId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 載入聯絡人
    const loadContacts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await contactsService.getAll();
            if (response.data) {
                setContacts(response.data.contacts);
            }
        } catch (error) {
            console.error('Failed to load contacts:', error);
            Alert.alert('錯誤', '載入聯絡人失敗');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadContacts();
    }, [loadContacts]);

    /**
     * 切換聯絡人啟用狀態
     */
    const toggleContactEnabled = async (contact: EmergencyContact) => {
        // 樂觀更新
        const originalContacts = [...contacts];
        setContacts(prev =>
            prev.map(c =>
                c.id === contact.id
                    ? { ...c, isEnabled: !c.isEnabled }
                    : c
            )
        );

        try {
            await contactsService.update(contact.id, {
                isEnabled: !contact.isEnabled
            });
        } catch (error) {
            // 還原狀態
            setContacts(originalContacts);
            Alert.alert('錯誤', '更新狀態失敗');
        }
    };

    /**
     * 刪除聯絡人
     */
    const handleDeleteContact = (id: number) => {
        Alert.alert(
            '確認刪除',
            '確定要刪除此緊急聯絡人嗎？',
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '刪除',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            await contactsService.delete(id);
                            // 重新載入列表
                            await loadContacts();
                        } catch (error) {
                            Alert.alert('錯誤', '刪除失敗');
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    };

    // 開啟新增模式
    const openAddModal = () => {
        setEditingContact(null);
        setFormName('');
        setFormPhone('');
        setFormLineId('');
        setIsModalVisible(true);
    };

    // 開啟編輯模式
    const openEditModal = (contact: EmergencyContact) => {
        setEditingContact(contact);
        setFormName(contact.name);
        setFormPhone(contact.phone);
        setFormLineId(contact.lineId || '');
        setIsModalVisible(true);
    };

    // 提交表單
    const handleSubmit = async () => {
        // 驗證邏輯：至少要有(電話) 或 (LINE ID)
        if (!formName.trim()) {
            Alert.alert('錯誤', '姓名為必填');
            return;
        }
        if (!formPhone.trim() && !formLineId.trim()) {
            Alert.alert('錯誤', '電話 或 LINE ID 請至少填寫這兩項之一');
            return;
        }

        setIsSubmitting(true);
        try {
            const contactData = {
                name: formName,
                phone: formPhone,
                lineId: formLineId,
            };

            if (editingContact) {
                // 更新
                const response = await contactsService.update(editingContact.id, contactData);
                if (response.error) throw new Error(response.error.message);
            } else {
                // 新增
                const response = await contactsService.create({
                    ...contactData,
                    priority: contacts.length + 1,
                });
                if (response.error) throw new Error(response.error.message);
            }

            setIsModalVisible(false);
            loadContacts();
        } catch (error: any) {
            Alert.alert('錯誤', error.message || '操作失敗');
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * 渲染聯絡人項目
     */
    const renderContactItem = ({ item }: { item: EmergencyContact }) => (
        <TouchableOpacity
            style={styles.contactCard}
            onPress={() => openEditModal(item)}
            activeOpacity={0.7}
        >
            <View style={styles.contactInfo}>
                <View style={styles.contactIcon}>
                    <Text style={styles.contactIconText}>
                        {item.name.charAt(0)}
                    </Text>
                </View>
                <View style={styles.contactDetails}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <View style={styles.contactMeta}>
                        {!!item.phone && <Text style={styles.contactPhone}>📞 {item.phone}</Text>}
                        {!!item.lineId && <Text style={styles.contactLine}>💬 {item.lineId}</Text>}
                    </View>
                    {!item.isEnabled && (
                        <Text style={styles.disabledLabel}>已停用</Text>
                    )}
                </View>
            </View>
            <View style={styles.contactActions}>
                <Switch
                    value={item.isEnabled}
                    onValueChange={() => toggleContactEnabled(item)}
                    trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
                    thumbColor={item.isEnabled ? COLORS.primary : COLORS.gray400}
                />
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteContact(item.id)}
                >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <GradientBackground variant="primary">
            <SafeAreaView style={styles.container}>
                {/* 頂部導航 */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>緊急聯絡人</Text>
                    <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                        <Text style={styles.addIcon}>＋</Text>
                    </TouchableOpacity>
                </View>

                {/* 聯絡人列表 */}
                {isLoading && contacts.length === 0 ? (
                    <ActivityIndicator size="large" color={COLORS.white} style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={contacts}
                        renderItem={renderContactItem}
                        keyExtractor={item => String(item.id)}
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
                )}

                {/* 新增/編輯 Modal */}
                <Modal
                    visible={isModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>
                                {editingContact ? '編輯聯絡人' : '新增聯絡人'}
                            </Text>

                            <Text style={styles.inputLabel}>姓名 *</Text>
                            <TextInput
                                style={styles.input}
                                value={formName}
                                onChangeText={setFormName}
                                placeholder="請輸入姓名"
                            />

                            <Text style={styles.inputLabel}>電話</Text>
                            <TextInput
                                style={styles.input}
                                value={formPhone}
                                onChangeText={setFormPhone}
                                placeholder="請輸入電話號碼"
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.inputLabel}>LINE ID</Text>
                            <TextInput
                                style={styles.input}
                                value={formLineId}
                                onChangeText={setFormLineId}
                                placeholder="請輸入 LINE ID (選填)"
                                autoCapitalize="none"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setIsModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.saveButton]}
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator color={COLORS.white} />
                                    ) : (
                                        <Text style={styles.saveButtonText}>儲存</Text>
                                    )}
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
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    backButton: { padding: SPACING.sm },
    backIcon: { fontSize: FONTS.size.xxl, color: COLORS.white },
    headerTitle: { fontSize: FONTS.size.xl, fontWeight: FONTS.bold as any, color: COLORS.white },
    addButton: {
        width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.warning,
        alignItems: 'center', justifyContent: 'center',
    },
    addIcon: { fontSize: FONTS.size.xl, color: COLORS.black, fontWeight: FONTS.bold as any },
    listContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxxl },
    contactCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.cardBackground, borderRadius: RADIUS.lg,
        padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.sm,
    },
    contactInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    contactIcon: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary,
        alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md,
    },
    contactIconText: { fontSize: FONTS.size.lg, fontWeight: FONTS.bold as any, color: COLORS.white },
    contactDetails: { flex: 1 },
    contactName: { fontSize: FONTS.size.lg, fontWeight: FONTS.semiBold as any, color: COLORS.textPrimary },
    contactMeta: { marginTop: SPACING.xs },
    contactPhone: { fontSize: FONTS.size.sm, color: COLORS.textSecondary },
    contactLine: { fontSize: FONTS.size.sm, color: COLORS.success, marginTop: 2 },
    disabledLabel: { fontSize: FONTS.size.xs, color: COLORS.danger, marginTop: SPACING.xs },
    contactActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    deleteButton: { padding: SPACING.xs },
    deleteIcon: { fontSize: 18 },
    emptyContainer: { alignItems: 'center', paddingTop: SPACING.huge },
    emptyText: { fontSize: FONTS.size.lg, color: COLORS.white, marginBottom: SPACING.sm },
    emptyHint: { fontSize: FONTS.size.md, color: COLORS.gray300 },

    // Modal Styles
    modalOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg,
    },
    modalContainer: {
        backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.xl,
        width: '100%', maxWidth: 400, ...SHADOWS.lg,
    },
    modalTitle: {
        fontSize: FONTS.size.xl, fontWeight: FONTS.bold as any, color: COLORS.textPrimary,
        marginBottom: SPACING.lg, textAlign: 'center',
    },
    inputLabel: { fontSize: FONTS.size.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs, marginTop: SPACING.md },
    input: {
        backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md,
        borderWidth: 1, borderColor: COLORS.gray200, fontSize: FONTS.size.md,
    },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.xl, gap: SPACING.md },
    modalButton: { flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.md, alignItems: 'center' },
    cancelButton: { backgroundColor: COLORS.gray100 },
    saveButton: { backgroundColor: COLORS.primary },
    cancelButtonText: { color: COLORS.textPrimary, fontWeight: FONTS.medium as any },
    saveButtonText: { color: COLORS.white, fontWeight: FONTS.bold as any },
});

export default EmergencyContactsScreen;

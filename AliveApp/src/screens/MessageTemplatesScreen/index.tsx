/**
 * MessageTemplatesScreen - 訊息模板管理頁面
 * 管理預設和自訂訊息模板
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import { GradientBackground } from '../../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { MessageTemplate, MessageTemplateType } from '../../types';
import { DEFAULT_MESSAGE_TEMPLATES } from '../../constants';

// 預設訊息模板
const DEFAULT_TEMPLATES: MessageTemplate[] = [
    {
        id: 'default_check_in',
        userId: 'system',
        type: 'check_in',
        title: '平安報到',
        content: DEFAULT_MESSAGE_TEMPLATES.CHECK_IN.content,
        isDefault: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'default_emergency',
        userId: 'system',
        type: 'emergency',
        title: '緊急提醒',
        content: DEFAULT_MESSAGE_TEMPLATES.EMERGENCY.content,
        isDefault: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'default_reminder',
        userId: 'system',
        type: 'reminder',
        title: '簽到提醒',
        content: DEFAULT_MESSAGE_TEMPLATES.REMINDER.content,
        isDefault: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

/**
 * 訊息模板管理頁面
 */
const MessageTemplatesScreen: React.FC = () => {
    const [templates, setTemplates] = useState<MessageTemplate[]>(DEFAULT_TEMPLATES);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    /**
     * 獲取模板類型的中文名稱
     */
    const getTypeLabel = (type: MessageTemplateType): string => {
        const labels: Record<MessageTemplateType, string> = {
            check_in: '簽到',
            emergency: '緊急',
            reminder: '提醒',
            custom: '自訂',
        };
        return labels[type];
    };

    /**
     * 獲取模板類型的顏色
     */
    const getTypeColor = (type: MessageTemplateType): string => {
        const colors: Record<MessageTemplateType, string> = {
            check_in: COLORS.success,
            emergency: COLORS.danger,
            reminder: COLORS.warning,
            custom: COLORS.info,
        };
        return colors[type];
    };

    /**
     * 開啟編輯模態框
     */
    const openEditModal = (template: MessageTemplate) => {
        setEditingTemplate(template);
        setNewTitle(template.title);
        setNewContent(template.content);
        setIsModalVisible(true);
    };

    /**
     * 開啟新增模態框
     */
    const openAddModal = () => {
        setEditingTemplate(null);
        setNewTitle('');
        setNewContent('');
        setIsModalVisible(true);
    };

    /**
     * 關閉模態框
     */
    const closeModal = () => {
        setIsModalVisible(false);
        setEditingTemplate(null);
        setNewTitle('');
        setNewContent('');
    };

    /**
     * 儲存訊息模板
     */
    const handleSave = () => {
        if (!newTitle.trim() || !newContent.trim()) {
            Alert.alert('錯誤', '請填寫標題和內容');
            return;
        }

        if (editingTemplate) {
            // 編輯現有模板
            setTemplates(prev =>
                prev.map(t =>
                    t.id === editingTemplate.id
                        ? { ...t, title: newTitle, content: newContent, updatedAt: new Date() }
                        : t
                )
            );
        } else {
            // 新增模板
            const newTemplate: MessageTemplate = {
                id: `custom_${Date.now()}`,
                userId: 'current_user',
                type: 'custom',
                title: newTitle,
                content: newContent,
                isDefault: false,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setTemplates(prev => [...prev, newTemplate]);
        }

        closeModal();
        Alert.alert('成功', '訊息模板已儲存');
    };

    /**
     * 刪除自訂模板
     */
    const handleDelete = (template: MessageTemplate) => {
        if (template.isDefault) {
            Alert.alert('提示', '預設模板無法刪除');
            return;
        }

        Alert.alert(
            '確認刪除',
            `確定要刪除「${template.title}」嗎？`,
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '刪除',
                    style: 'destructive',
                    onPress: () => {
                        setTemplates(prev => prev.filter(t => t.id !== template.id));
                    },
                },
            ]
        );
    };

    /**
     * 渲染訊息模板卡片
     */
    const renderTemplateCard = (template: MessageTemplate) => (
        <TouchableOpacity
            key={template.id}
            style={styles.templateCard}
            onPress={() => openEditModal(template)}
            activeOpacity={0.8}
        >
            <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                    <View
                        style={[
                            styles.typeBadge,
                            { backgroundColor: getTypeColor(template.type) },
                        ]}
                    >
                        <Text style={styles.typeBadgeText}>
                            {getTypeLabel(template.type)}
                        </Text>
                    </View>
                    <Text style={styles.templateTitle}>{template.title}</Text>
                </View>
                {!template.isDefault && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(template)}
                    >
                        <Text style={styles.deleteIcon}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.templateContent} numberOfLines={2}>
                {template.content}
            </Text>
            {template.isDefault && (
                <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>預設模板</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <GradientBackground variant="light">
            <SafeAreaView style={styles.container}>
                {/* 頂部導航 */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>訊息模板</Text>
                    <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                        <Text style={styles.addIcon}>＋</Text>
                    </TouchableOpacity>
                </View>

                {/* 說明文字 */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        設定緊急通知時發送的訊息內容。支援變數：[姓名]、[天數]、[時間]
                    </Text>
                </View>

                {/* 模板列表 */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {templates.map(renderTemplateCard)}
                </ScrollView>

                {/* 編輯/新增模態框 */}
                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {editingTemplate ? '編輯模板' : '新增模板'}
                                </Text>
                                <TouchableOpacity onPress={closeModal}>
                                    <Text style={styles.closeIcon}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalBody}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>標題</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={newTitle}
                                        onChangeText={setNewTitle}
                                        placeholder="輸入模板標題"
                                        placeholderTextColor={COLORS.textLight}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>內容</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        value={newContent}
                                        onChangeText={setNewContent}
                                        placeholder="輸入訊息內容，可使用 [姓名]、[天數] 等變數"
                                        placeholderTextColor={COLORS.textLight}
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
                                </View>

                                <View style={styles.variableHints}>
                                    <Text style={styles.hintTitle}>可用變數：</Text>
                                    <Text style={styles.hintText}>[姓名] - 用戶名稱</Text>
                                    <Text style={styles.hintText}>[天數] - 未簽到天數</Text>
                                    <Text style={styles.hintText}>[時間] - 當前時間</Text>
                                </View>
                            </View>

                            <View style={styles.modalFooter}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={closeModal}
                                >
                                    <Text style={styles.cancelButtonText}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={handleSave}
                                >
                                    <Text style={styles.saveButtonText}>儲存</Text>
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
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addIcon: {
        fontSize: FONTS.size.xl,
        color: COLORS.white,
        fontWeight: FONTS.bold as any,
    },
    infoContainer: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
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
    templateCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    typeBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.sm,
        marginRight: SPACING.sm,
    },
    typeBadgeText: {
        fontSize: FONTS.size.xs,
        color: COLORS.white,
        fontWeight: FONTS.medium as any,
    },
    templateTitle: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.semiBold as any,
        color: COLORS.textPrimary,
        flex: 1,
    },
    deleteButton: {
        padding: SPACING.xs,
    },
    deleteIcon: {
        fontSize: FONTS.size.lg,
        color: COLORS.textLight,
    },
    templateContent: {
        fontSize: FONTS.size.md,
        color: COLORS.textSecondary,
        lineHeight: FONTS.size.md * 1.5,
    },
    defaultBadge: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        backgroundColor: COLORS.gray100,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.sm,
    },
    defaultBadgeText: {
        fontSize: FONTS.size.xs,
        color: COLORS.textLight,
    },
    // Modal 樣式
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    modalTitle: {
        fontSize: FONTS.size.xl,
        fontWeight: FONTS.bold as any,
        color: COLORS.textPrimary,
    },
    closeIcon: {
        fontSize: FONTS.size.xl,
        color: COLORS.textLight,
    },
    modalBody: {
        padding: SPACING.lg,
    },
    inputGroup: {
        marginBottom: SPACING.lg,
    },
    inputLabel: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray300,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        fontSize: FONTS.size.md,
        color: COLORS.textPrimary,
    },
    textArea: {
        height: 100,
    },
    variableHints: {
        backgroundColor: COLORS.gray100,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
    },
    hintTitle: {
        fontSize: FONTS.size.sm,
        fontWeight: FONTS.semiBold as any,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    hintText: {
        fontSize: FONTS.size.sm,
        color: COLORS.textLight,
        marginTop: SPACING.xs,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: SPACING.lg,
        gap: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray200,
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
    saveButton: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: FONTS.size.md,
        color: COLORS.white,
        fontWeight: FONTS.semiBold as any,
    },
});

export default MessageTemplatesScreen;

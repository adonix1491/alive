/**
 * AnomalyRulesScreen - 異常規則管理頁面
 * 設定觸發通知的異常條件
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
} from 'react-native';
import { GradientBackground } from '../../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { AnomalyRule } from '../../types';

// 預設異常規則
const DEFAULT_RULES: AnomalyRule[] = [
    {
        id: 'rule_1',
        userId: 'current_user',
        name: '連續未簽到 2 天',
        description: '當連續 2 天未簽到時，通知所有緊急聯絡人',
        condition: { type: 'missed_checkin', days: 2 },
        isEnabled: true,
        notifyContacts: ['all'],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'rule_2',
        userId: 'current_user',
        name: '連續未簽到 7 天',
        description: '當連續 7 天未簽到時，發送緊急警報',
        condition: { type: 'missed_checkin', days: 7 },
        isEnabled: false,
        notifyContacts: ['all'],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

/**
 * 異常規則管理頁面
 */
const AnomalyRulesScreen: React.FC = () => {
    const [rules, setRules] = useState<AnomalyRule[]>(DEFAULT_RULES);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRule, setEditingRule] = useState<AnomalyRule | null>(null);
    const [ruleName, setRuleName] = useState('');
    const [ruleDays, setRuleDays] = useState('');

    /**
     * 切換規則啟用狀態
     */
    const toggleRule = (ruleId: string) => {
        setRules(prev =>
            prev.map(rule =>
                rule.id === ruleId ? { ...rule, isEnabled: !rule.isEnabled } : rule
            )
        );
    };

    /**
     * 開啟新增模態框
     */
    const openAddModal = () => {
        setEditingRule(null);
        setRuleName('');
        setRuleDays('');
        setIsModalVisible(true);
    };

    /**
     * 開啟編輯模態框
     */
    const openEditModal = (rule: AnomalyRule) => {
        setEditingRule(rule);
        setRuleName(rule.name);
        setRuleDays(rule.condition.days?.toString() || '');
        setIsModalVisible(true);
    };

    /**
     * 關閉模態框
     */
    const closeModal = () => {
        setIsModalVisible(false);
        setEditingRule(null);
        setRuleName('');
        setRuleDays('');
    };

    /**
     * 儲存規則
     */
    const handleSave = () => {
        const days = parseInt(ruleDays, 10);

        if (!ruleName.trim()) {
            Alert.alert('錯誤', '請輸入規則名稱');
            return;
        }

        if (isNaN(days) || days < 1 || days > 30) {
            Alert.alert('錯誤', '天數必須在 1-30 之間');
            return;
        }

        if (editingRule) {
            // 編輯現有規則
            setRules(prev =>
                prev.map(rule =>
                    rule.id === editingRule.id
                        ? {
                            ...rule,
                            name: ruleName,
                            description: `當連續 ${days} 天未簽到時，通知所有緊急聯絡人`,
                            condition: { type: 'missed_checkin', days },
                            updatedAt: new Date(),
                        }
                        : rule
                )
            );
        } else {
            // 新增規則
            const newRule: AnomalyRule = {
                id: `rule_${Date.now()}`,
                userId: 'current_user',
                name: ruleName,
                description: `當連續 ${days} 天未簽到時，通知所有緊急聯絡人`,
                condition: { type: 'missed_checkin', days },
                isEnabled: true,
                notifyContacts: ['all'],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setRules(prev => [...prev, newRule]);
        }

        closeModal();
        Alert.alert('成功', '異常規則已儲存');
    };

    /**
     * 刪除規則
     */
    const handleDelete = (rule: AnomalyRule) => {
        Alert.alert(
            '確認刪除',
            `確定要刪除「${rule.name}」嗎？`,
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '刪除',
                    style: 'destructive',
                    onPress: () => {
                        setRules(prev => prev.filter(r => r.id !== rule.id));
                    },
                },
            ]
        );
    };

    /**
     * 渲染規則卡片
     */
    const renderRuleCard = (rule: AnomalyRule) => (
        <View key={rule.id} style={styles.ruleCard}>
            <TouchableOpacity
                style={styles.ruleContent}
                onPress={() => openEditModal(rule)}
                activeOpacity={0.7}
            >
                <View style={styles.ruleHeader}>
                    <View style={styles.ruleIcon}>
                        <Text style={styles.ruleIconText}>⚠️</Text>
                    </View>
                    <View style={styles.ruleInfo}>
                        <Text style={styles.ruleName}>{rule.name}</Text>
                        <Text style={styles.ruleDesc}>{rule.description}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <View style={styles.ruleActions}>
                <Switch
                    value={rule.isEnabled}
                    onValueChange={() => toggleRule(rule.id)}
                    trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
                    thumbColor={rule.isEnabled ? COLORS.primary : COLORS.gray400}
                />
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(rule)}
                >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
            </View>
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
                    <Text style={styles.headerTitle}>異常規則</Text>
                    <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                        <Text style={styles.addIcon}>＋</Text>
                    </TouchableOpacity>
                </View>

                {/* 說明 */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        設定觸發緊急通知的條件。當符合規則條件時，系統會自動通知您的緊急聯絡人。
                    </Text>
                </View>

                {/* 規則列表 */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {rules.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>📋</Text>
                            <Text style={styles.emptyText}>尚未設定任何規則</Text>
                            <Text style={styles.emptyHint}>
                                點擊右上角 ＋ 添加您的第一個異常規則
                            </Text>
                        </View>
                    ) : (
                        rules.map(renderRuleCard)
                    )}

                    {/* 提示區塊 */}
                    {rules.length > 0 && (
                        <View style={styles.tipContainer}>
                            <Text style={styles.tipTitle}>💡 小提示</Text>
                            <Text style={styles.tipText}>
                                建議設定多個不同天數的規則，例如：2天時發送提醒，7天時發送緊急警報。
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* 新增/編輯模態框 */}
                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                {editingRule ? '編輯規則' : '新增規則'}
                            </Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>規則名稱</Text>
                                <TextInput
                                    style={styles.input}
                                    value={ruleName}
                                    onChangeText={setRuleName}
                                    placeholder="例如：連續未簽到 3 天"
                                    placeholderTextColor={COLORS.textLight}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>未簽到天數</Text>
                                <View style={styles.daysInputContainer}>
                                    <TextInput
                                        style={[styles.input, styles.daysInput]}
                                        value={ruleDays}
                                        onChangeText={setRuleDays}
                                        placeholder="2"
                                        placeholderTextColor={COLORS.textLight}
                                        keyboardType="numeric"
                                        maxLength={2}
                                    />
                                    <Text style={styles.daysUnit}>天</Text>
                                </View>
                                <Text style={styles.inputHint}>
                                    當連續 {ruleDays || '?'} 天未簽到時觸發通知
                                </Text>
                            </View>

                            <View style={styles.modalButtons}>
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
    ruleCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    ruleContent: {
        marginBottom: SPACING.md,
    },
    ruleHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    ruleIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.warning + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    ruleIconText: {
        fontSize: 20,
    },
    ruleInfo: {
        flex: 1,
    },
    ruleName: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.semiBold as any,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    ruleDesc: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        lineHeight: FONTS.size.sm * 1.4,
    },
    ruleActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray200,
    },
    deleteButton: {
        padding: SPACING.sm,
    },
    deleteIcon: {
        fontSize: 18,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: SPACING.huge,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: SPACING.lg,
    },
    emptyText: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.medium as any,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    emptyHint: {
        fontSize: FONTS.size.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    tipContainer: {
        backgroundColor: COLORS.info + '15',
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginTop: SPACING.lg,
    },
    tipTitle: {
        fontSize: FONTS.size.md,
        fontWeight: FONTS.semiBold as any,
        color: COLORS.info,
        marginBottom: SPACING.sm,
    },
    tipText: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
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
        marginBottom: SPACING.xl,
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
    daysInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    daysInput: {
        flex: 1,
        textAlign: 'center',
    },
    daysUnit: {
        fontSize: FONTS.size.lg,
        color: COLORS.textSecondary,
        marginLeft: SPACING.md,
    },
    inputHint: {
        fontSize: FONTS.size.xs,
        color: COLORS.textLight,
        marginTop: SPACING.sm,
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: SPACING.lg,
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

export default AnomalyRulesScreen;

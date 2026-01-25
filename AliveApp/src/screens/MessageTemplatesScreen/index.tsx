/**
 * MessageTemplatesScreen - 訊息模板設定
 * 讓用戶設定發送給緊急聯絡人的預設訊息和自訂訊息
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { GradientBackground } from '../../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { messageService } from '../../services/api';

const MessageTemplatesScreen: React.FC = () => {
    const navigation = useNavigation();

    const [defaultMessage, setDefaultMessage] = useState('用戶已經2天未登入ALIVE!! 愛來ㄛ');
    const [customMessage, setCustomMessage] = useState('');
    const [isEditingDefault, setIsEditingDefault] = useState(false);
    const [isEditingCustom, setIsEditingCustom] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load template on mount
    React.useEffect(() => {
        loadTemplate();
    }, []);

    const loadTemplate = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await messageService.getTemplates();
            if (data?.templates) {
                const system = data.templates.find(t => t.type === 'system');
                const custom = data.templates.find(t => t.type === 'custom');

                if (system) setDefaultMessage(system.content);
                if (custom) setCustomMessage(custom.content);
            } else if (error) {
                console.log('Load templates error:', error);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveDefault = async () => {
        if (!defaultMessage.trim()) {
            Alert.alert('提示', '預設訊息不能為空');
            return;
        }

        setIsSaving(true);
        const { data, error } = await messageService.saveTemplate({
            type: 'system',
            content: defaultMessage.trim(),
        });
        setIsSaving(false);

        if (data) {
            setIsEditingDefault(false);
            Alert.alert('成功', '預設訊息已更新');
        } else {
            Alert.alert('錯誤', error?.message || '儲存失敗');
        }
    };

    const handleSaveCustom = async () => {
        setIsSaving(true);
        const { data, error } = await messageService.saveTemplate({
            type: 'custom',
            content: customMessage.trim(),
        });
        setIsSaving(false);

        if (data) {
            setIsEditingCustom(false);
            Alert.alert('成功', '自訂訊息已儲存');
        } else {
            Alert.alert('錯誤', error?.message || '儲存失敗');
        }
    };

    return (
        <GradientBackground variant="light">
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>訊息模板</Text>
                    <View style={{ width: 40 }} />
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : (
                    <ScrollView style={styles.content}>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>預設通知訊息 (主要內容)</Text>
                                {!isEditingDefault ? (
                                    <TouchableOpacity onPress={() => setIsEditingDefault(true)}>
                                        <Text style={styles.editLink}>編輯</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={handleSaveDefault} disabled={isSaving}>
                                        <Text style={[styles.saveLink, isSaving && { opacity: 0.5 }]}>
                                            {isSaving ? '儲存中...' : '完成'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {isEditingDefault ? (
                                <TextInput
                                    style={styles.input}
                                    value={defaultMessage}
                                    onChangeText={setDefaultMessage}
                                    multiline
                                    textAlignVertical="top"
                                />
                            ) : (
                                <View style={styles.card}>
                                    <Text style={styles.messageText}>{defaultMessage}</Text>
                                </View>
                            )}
                            <Text style={styles.hintText}>當觸發異常時，系統將優先發送此訊息。</Text>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>自訂附加訊息 (選填)</Text>
                                {!isEditingCustom ? (
                                    <TouchableOpacity onPress={() => setIsEditingCustom(true)}>
                                        <Text style={styles.editLink}>編輯</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={handleSaveCustom} disabled={isSaving}>
                                        <Text style={[styles.saveLink, isSaving && { opacity: 0.5 }]}>
                                            {isSaving ? '儲存中...' : '完成'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {isEditingCustom ? (
                                <TextInput
                                    style={styles.input}
                                    value={customMessage}
                                    onChangeText={setCustomMessage}
                                    multiline
                                    placeholder="額外補充的訊息..."
                                    textAlignVertical="top"
                                />
                            ) : (
                                <View style={styles.card}>
                                    <Text style={[styles.messageText, !customMessage && styles.placeholderText]}>
                                        {customMessage || '(無附加訊息)'}
                                    </Text>
                                </View>
                            )}
                            <Text style={styles.hintText}>此內容將附加在預設訊息之後。</Text>
                        </View>
                    </ScrollView>
                )}
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
        paddingBottom: SPACING.md,
    },
    backButton: { padding: SPACING.sm },
    backIcon: { fontSize: FONTS.size.xxl, color: COLORS.textPrimary },
    headerTitle: { fontSize: FONTS.size.xl, fontWeight: FONTS.bold as any, color: COLORS.textPrimary },
    content: { flex: 1, padding: SPACING.lg },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    section: { marginBottom: SPACING.xxl },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
    sectionTitle: { fontSize: FONTS.size.lg, fontWeight: FONTS.bold as any, color: COLORS.textPrimary, marginBottom: SPACING.sm },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        ...SHADOWS.sm,
    },
    messageText: { fontSize: FONTS.size.md, color: COLORS.textPrimary, lineHeight: 24 },
    placeholderText: { color: COLORS.textSecondary, fontStyle: 'italic' },
    hintText: { fontSize: FONTS.size.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        height: 120,
        fontSize: FONTS.size.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
        ...SHADOWS.sm,
    },
    editLink: { color: COLORS.primary, fontSize: FONTS.size.md, fontWeight: FONTS.bold as any },
    saveLink: { color: COLORS.success, fontSize: FONTS.size.md, fontWeight: FONTS.bold as any },
});

export default MessageTemplatesScreen;


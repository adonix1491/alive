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
} from 'react-native';
import { GradientBackground } from '../../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

const MessageTemplatesScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth();

    const [defaultMessage, setDefaultMessage] = useState('我長時間未簽到，可能發生意外，請嘗試聯繫我或協助確認我的安全。');
    const [customMessage, setCustomMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        // TODO: Call API to save settings
        setIsEditing(false);
        Alert.alert('成功', '訊息模板已儲存');
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

                <ScrollView style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>預設通知訊息</Text>
                        <View style={styles.card}>
                            <Text style={styles.messageText}>{defaultMessage}</Text>
                        </View>
                        <Text style={styles.hintText}>此為系統預設的緊急通知內容。</Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>自訂通知訊息</Text>
                            {!isEditing ? (
                                <TouchableOpacity onPress={() => setIsEditing(true)}>
                                    <Text style={styles.editLink}>編輯</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={handleSave}>
                                    <Text style={styles.saveLink}>完成</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={customMessage}
                                onChangeText={setCustomMessage}
                                multiline
                                placeholder="請輸入您想對緊急聯絡人說的話..."
                                textAlignVertical="top"
                            />
                        ) : (
                            <View style={styles.card}>
                                <Text style={[styles.messageText, !customMessage && styles.placeholderText]}>
                                    {customMessage || '點擊編輯以設定自訂訊息...'}
                                </Text>
                            </View>
                        )}
                        <Text style={styles.hintText}>自訂訊息將附加在預設訊息之後發送。</Text>
                    </View>
                </ScrollView>
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
    section: { mb: SPACING.xxl },
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

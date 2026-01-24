/**
 * SettingsScreen - 設置中心頁面
 * 管理簽到機制、緊急聯絡人、通知設定等
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
    Alert,
} from 'react-native';
import { contactsService } from '../../services/api';

/**
 * 設置中心頁面
 * 包含簽到機制設定、緊急聯絡人管理
 */
const SettingsScreen: React.FC = () => {
    // 簽到機制設定 delay logic for now
    const [intervalDays, setIntervalDays] = useState(
        DEFAULT_CHECK_IN_SETTINGS.INTERVAL_DAYS.toString()
    );

    // 緊急聯絡人資料
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * 處理儲存設定 (新增聯絡人)
     */
    const handleSave = async () => {
        // 驗證輸入
        if (!contactName.trim() || !contactPhone.trim()) {
            Alert.alert('錯誤', '請輸入聯絡人姓名和電話');
            return;
        }

        setIsLoading(true);
        try {
            const result = await contactsService.create({
                name: contactName,
                phoneNumber: contactPhone,
                email: contactEmail,
                priority: 1, // Default priority
            });

            if (result.data) {
                Alert.alert('成功', '聯絡人已新增');
                // Clear form
                setContactName('');
                setContactPhone('');
                setContactEmail('');
            } else {
                Alert.alert('失敗', result.error?.message || '新增失敗');
            }
        } catch (error) {
            Alert.alert('錯誤', '連線發生問題');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GradientBackground variant="primary">
            <SafeAreaView style={styles.container}>
                {/* 頂部導航 */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>設置中心</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* 簽到機制設定區 */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionIcon}>⏱️</Text>
                            <Text style={styles.sectionTitle}>簽到機制</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.fieldLabel}>未簽到通知天數</Text>
                            <TextInput
                                style={styles.input}
                                value={intervalDays}
                                onChangeText={setIntervalDays}
                                keyboardType="numeric"
                                placeholder="輸入天數"
                                placeholderTextColor={COLORS.textLight}
                            />
                            <Text style={styles.fieldHint}>
                                設定連續幾天未簽到後通知緊急聯絡人
                            </Text>
                        </View>
                    </View>

                    {/* 緊急聯絡人設定區 */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionIcon}>👤</Text>
                            <Text style={styles.sectionTitle}>緊急聯絡人</Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.field}>
                                <Text style={styles.fieldLabel}>姓名</Text>
                                <TextInput
                                    style={styles.input}
                                    value={contactName}
                                    onChangeText={setContactName}
                                    placeholder="輸入聯絡人姓名"
                                    placeholderTextColor={COLORS.textLight}
                                />
                            </View>

                            <View style={styles.field}>
                                <Text style={styles.fieldLabel}>電子郵箱</Text>
                                <TextInput
                                    style={styles.input}
                                    value={contactEmail}
                                    onChangeText={setContactEmail}
                                    placeholder="輸入電子郵箱"
                                    placeholderTextColor={COLORS.textLight}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.field}>
                                <Text style={styles.fieldLabel}>手機號碼</Text>
                                <TextInput
                                    style={styles.input}
                                    value={contactPhone}
                                    onChangeText={setContactPhone}
                                    placeholder="輸入手機號碼"
                                    placeholderTextColor={COLORS.textLight}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    </View>

                    {/* 儲存按鈕 */}
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.saveButtonText}>保存並應用</Text>
                    </TouchableOpacity>
                </ScrollView>
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
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xxxl,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionIcon: {
        fontSize: FONTS.size.lg,
        marginRight: SPACING.sm,
    },
    sectionTitle: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.semiBold as any,
        color: COLORS.white,
    },
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        ...SHADOWS.md,
    },
    field: {
        marginBottom: SPACING.lg,
    },
    fieldLabel: {
        fontSize: FONTS.size.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    fieldHint: {
        fontSize: FONTS.size.xs,
        color: COLORS.textLight,
        marginTop: SPACING.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray300,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        fontSize: FONTS.size.md,
        color: COLORS.textPrimary,
        backgroundColor: COLORS.white,
    },
    saveButton: {
        backgroundColor: COLORS.black,
        borderRadius: RADIUS.md,
        paddingVertical: SPACING.lg,
        alignItems: 'center',
        marginTop: SPACING.xl,
        ...SHADOWS.md,
    },
    saveButtonText: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.semiBold as any,
        color: COLORS.white,
    },
});

export default SettingsScreen;

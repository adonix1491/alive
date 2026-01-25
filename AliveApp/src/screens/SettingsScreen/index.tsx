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
import { GradientBackground } from '../../components';
import { contactsService } from '../../services/api';
import { DEFAULT_CHECK_IN_SETTINGS } from '../../constants';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

/**
 * 設置中心頁面
 * 包含簽到機制設定、緊急聯絡人管理
 */
const SettingsScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // 簽到機制設定 delay logic
    const [intervalDays, setIntervalDays] = useState(
        DEFAULT_CHECK_IN_SETTINGS.INTERVAL_DAYS.toString()
    );

    // 緊急聯絡人資料
    const [contacts, setContacts] = useState<any[]>([]);

    // 載入聯絡人
    React.useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const res = await contactsService.getAll();
            if (res.data) {
                setContacts(res.data.contacts);
            }
        } catch (error) {
            console.error('Load contacts failed:', error);
        }
    };



    /**
     * 刪除聯絡人
     */
    const handleDeleteContact = async (id: number) => {
        try {
            await contactsService.delete(id);
            Alert.alert('成功', '聯絡人已刪除');
            loadContacts();
        } catch (error) {
            Alert.alert('錯誤', '刪除失敗');
        }
    };

    return (
        <GradientBackground variant="primary">
            <SafeAreaView style={styles.container}>
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
                    {/* 簽到頻率 */}
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
                        </View>
                    </View>

                    {/* 聯絡人列表 */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionIcon}>👥</Text>
                            <Text style={styles.sectionTitle}>已存聯絡人 ({contacts.length}/5)</Text>
                        </View>

                        {contacts.map((contact) => (
                            <View key={contact.id} style={styles.contactItem}>
                                <View>
                                    <Text style={styles.contactName}>{contact.name}</Text>
                                    <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDeleteContact(contact.id)}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteText}>刪除</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    {/* 通知訊息設定 */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionIcon}>💬</Text>
                            <Text style={styles.sectionTitle}>通知訊息</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('MessageTemplates')}
                        >
                            <View style={styles.rowBetween}>
                                <Text style={styles.fieldLabel}>預設訊息內容</Text>
                                <Text style={styles.valueText}>系統預設 ›</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
    backButton: { padding: SPACING.sm },
    backIcon: { fontSize: 24, color: COLORS.white },
    headerTitle: { fontSize: 18, color: COLORS.white, fontWeight: 'bold' },
    placeholder: { width: 40 },
    scrollView: { flex: 1 },
    scrollContent: { padding: SPACING.lg, paddingBottom: 100 },
    section: { marginBottom: SPACING.xl },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
    sectionIcon: { fontSize: 18, marginRight: 8 },
    sectionTitle: { fontSize: 16, color: COLORS.white, fontWeight: 'bold' },
    card: { backgroundColor: COLORS.cardBackground, borderRadius: RADIUS.lg, padding: SPACING.lg },
    field: { marginBottom: SPACING.md },
    fieldLabel: { color: COLORS.textSecondary, marginBottom: 4, fontSize: 12 },
    input: { backgroundColor: COLORS.white, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#ddd' },
    saveButton: { backgroundColor: COLORS.black, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    saveButtonText: { color: COLORS.white, fontWeight: 'bold' },
    contactItem: { backgroundColor: 'rgba(255,255,255,0.9)', padding: 12, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    contactName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    contactPhone: { fontSize: 14, color: '#666' },
    deleteButton: { backgroundColor: '#ff4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
    deleteText: { color: 'white', fontSize: 12 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    valueText: { fontSize: 14, color: COLORS.textSecondary },
});

export default SettingsScreen;

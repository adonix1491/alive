/**
 * 登入/註冊畫面
 * 統一的認證介面
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';

export const AuthScreen: React.FC = () => {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // 表單狀態
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    /**
     * 處理登入
     */
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('錯誤', '請輸入 Email 和密碼');
            return;
        }

        setIsLoading(true);
        const result = await login(email, password);
        setIsLoading(false);

        if (!result.success) {
            Alert.alert('登入失敗', result.error || '請檢查您的帳號密碼');
        }
    };

    /**
     * 處理註冊
     */
    const handleRegister = async () => {
        if (!email || !password || !name) {
            Alert.alert('錯誤', '請填寫所有必填欄位');
            return;
        }

        if (password.length < 8) {
            Alert.alert('錯誤', '密碼必須至少 8 個字元');
            return;
        }

        setIsLoading(true);
        const result = await register(email, password, name, phoneNumber);
        setIsLoading(false);

        if (!result.success) {
            Alert.alert('註冊失敗', result.error || '請稍後再試');
        }
    };

    /**
     * 切換模式
     */
    const toggleMode = () => {
        setIsLogin(!isLogin);
        // 清空表單
        setEmail('');
        setPassword('');
        setName('');
        setPhoneNumber('');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Logo */}
                <View style={styles.header}>
                    <Text style={styles.logo}>😊</Text>
                    <Text style={styles.title}>ALIVE 愛來</Text>
                    <Text style={styles.subtitle}>安全簽到，守護彼此</Text>
                </View>

                {/* 表單 */}
                <View style={styles.form}>
                    <Text style={styles.formTitle}>{isLogin ? '登入' : '註冊'}</Text>

                    {/* 註冊時顯示姓名 */}
                    {!isLogin && (
                        <TextInput
                            style={styles.input}
                            placeholder="姓名"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor={COLORS.textSecondary}
                        />
                    )}

                    {/* Email */}
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={COLORS.textSecondary}
                    />

                    {/* 密碼 */}
                    <TextInput
                        style={styles.input}
                        placeholder="密碼（至少 8 個字元）"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor={COLORS.textSecondary}
                    />

                    {/* 註冊時顯示電話 */}
                    {!isLogin && (
                        <TextInput
                            style={styles.input}
                            placeholder="電話（選填）"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            placeholderTextColor={COLORS.textSecondary}
                        />
                    )}

                    {/* 提交按鈕 */}
                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={isLogin ? handleLogin : handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.buttonText}>{isLogin ? '登入' : '註冊'}</Text>
                        )}
                    </TouchableOpacity>

                    {/* 切換模式 */}
                    <TouchableOpacity style={styles.switchButton} onPress={toggleMode}>
                        <Text style={styles.switchText}>
                            {isLogin ? '還沒有帳號？' : '已經有帳號？'}
                            <Text style={styles.switchTextBold}>
                                {isLogin ? ' 立即註冊' : ' 登入'}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    logo: {
        fontSize: 80,
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: FONTS.size.xxl,
        fontWeight: FONTS.bold as any,
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONTS.size.md,
        color: COLORS.textSecondary,
    },
    form: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    formTitle: {
        fontSize: FONTS.size.xl,
        fontWeight: FONTS.bold as any,
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        fontSize: FONTS.size.md,
        borderWidth: 1,
        borderColor: COLORS.gray200,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: FONTS.size.md,
        fontWeight: FONTS.semiBold as any,
    },
    switchButton: {
        marginTop: SPACING.lg,
        alignItems: 'center',
    },
    switchText: {
        fontSize: FONTS.size.md,
        color: COLORS.textSecondary,
    },
    switchTextBold: {
        color: COLORS.primary,
        fontWeight: FONTS.semiBold as any,
    },
});

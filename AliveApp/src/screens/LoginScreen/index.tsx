/**
 * LoginScreen - 登入頁面
 * 用戶身份驗證入口
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { GradientBackground } from '../../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { APP_INFO } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 登入頁面
 */
const LoginScreen: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * 處理登入
     */
    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('錯誤', '請輸入電子郵箱和密碼');
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                // 登入成功，Navigation 會自動根據 isAuthenticated 狀態切換路由
                // 無需手動導航
            } else {
                Alert.alert('登入失敗', result.error || '請檢查您的憑證');
            }
        } catch (error) {
            Alert.alert('錯誤', '登入過程中發生異常');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * 處理忘記密碼
     */
    const handleForgotPassword = () => {
        Alert.alert('提示', '密碼重設郵件已發送至您的信箱');
    };

    /**
     * 處理註冊
     */
    const handleRegister = () => {
        // TODO: 導航至註冊頁面
        Alert.alert('提示', '前往註冊頁面');
    };

    return (
        <GradientBackground variant="primary">
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    {/* Logo 區域 */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoEmoji}>😊</Text>
                        </View>
                        <Text style={styles.appName}>{APP_INFO.NAME}</Text>
                        <Text style={styles.slogan}>{APP_INFO.SLOGAN}</Text>
                    </View>

                    {/* 登入表單 */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>電子郵箱</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="請輸入電子郵箱"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>密碼</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="請輸入密碼"
                                placeholderTextColor={COLORS.textLight}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.forgotPassword}
                            onPress={handleForgotPassword}
                        >
                            <Text style={styles.forgotPasswordText}>忘記密碼？</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            <Text style={styles.loginButtonText}>
                                {isLoading ? '登入中...' : '登入'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>還沒有帳號？</Text>
                            <TouchableOpacity onPress={handleRegister}>
                                <Text style={styles.registerLink}>立即註冊</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 第三方登入 */}
                    <View style={styles.socialContainer}>
                        <Text style={styles.socialText}>或使用以下方式登入</Text>
                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Text style={styles.socialButtonText}>LINE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: SPACING.xl,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xxxl,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    logoEmoji: {
        fontSize: 50,
    },
    appName: {
        fontSize: FONTS.size.title,
        fontWeight: FONTS.bold as any,
        color: COLORS.white,
        marginBottom: SPACING.sm,
    },
    slogan: {
        fontSize: FONTS.size.md,
        color: COLORS.white,
        opacity: 0.8,
    },
    formContainer: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: RADIUS.xl,
        padding: SPACING.xl,
        ...SHADOWS.lg,
    },
    inputContainer: {
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: SPACING.lg,
    },
    forgotPasswordText: {
        fontSize: FONTS.size.sm,
        color: COLORS.primary,
    },
    loginButton: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.md,
        paddingVertical: SPACING.lg,
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.semiBold as any,
        color: COLORS.white,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerText: {
        fontSize: FONTS.size.md,
        color: COLORS.textSecondary,
    },
    registerLink: {
        fontSize: FONTS.size.md,
        color: COLORS.primary,
        fontWeight: FONTS.semiBold as any,
        marginLeft: SPACING.xs,
    },
    socialContainer: {
        marginTop: SPACING.xxxl,
        alignItems: 'center',
    },
    socialText: {
        fontSize: FONTS.size.sm,
        color: COLORS.white,
        opacity: 0.8,
        marginBottom: SPACING.lg,
    },
    socialButtons: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    socialButton: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        ...SHADOWS.sm,
    },
    socialButtonText: {
        fontSize: FONTS.size.md,
        fontWeight: FONTS.medium as any,
        color: COLORS.textPrimary,
    },
});

export default LoginScreen;

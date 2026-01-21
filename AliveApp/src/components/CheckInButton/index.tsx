/**
 * CheckInButton - 一鍵簽到按鈕元件
 * 核心簽到功能的主要互動元件，提供動態視覺反饋
 */
import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    ViewStyle,
} from 'react-native';
import { COLORS, FONTS, SPACING, CHECK_IN_BUTTON, SHADOWS } from '../../theme';

interface CheckInButtonProps {
    /** 是否已簽到 */
    isCheckedIn: boolean;
    /** 簽到回調函數 */
    onPress: () => void;
    /** 是否禁用 */
    disabled?: boolean;
    /** 自訂樣式 */
    style?: ViewStyle;
}

/**
 * 一鍵簽到按鈕
 * @param isCheckedIn 當前是否已完成簽到
 * @param onPress 點擊簽到時的回調
 * @param disabled 是否禁用按鈕
 * @param style 自訂容器樣式
 */
const CheckInButton: React.FC<CheckInButtonProps> = ({
    isCheckedIn,
    onPress,
    disabled = false,
    style,
}) => {
    // 動畫值
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const checkAnim = useRef(new Animated.Value(isCheckedIn ? 1 : 0)).current;

    // 脈衝動畫效果（未簽到時）
    useEffect(() => {
        if (!isCheckedIn) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isCheckedIn, pulseAnim]);

    // 簽到成功動畫
    useEffect(() => {
        Animated.timing(checkAnim, {
            toValue: isCheckedIn ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isCheckedIn, checkAnim]);

    /**
     * 處理按下事件
     * 提供縮放的觸覺反饋
     */
    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    /**
     * 處理放開事件
     */
    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={[styles.container, style]}>
            {/* 外層脈衝光暈 */}
            <Animated.View
                style={[
                    styles.pulseRing,
                    {
                        transform: [{ scale: pulseAnim }],
                        opacity: isCheckedIn ? 0 : 0.3,
                    },
                ]}
            />

            {/* 主按鈕 */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
            >
                <Animated.View
                    style={[
                        styles.button,
                        isCheckedIn && styles.buttonChecked,
                        { transform: [{ scale: scaleAnim }] },
                    ]}
                >
                    {/* 內圈 */}
                    <View
                        style={[
                            styles.innerCircle,
                            isCheckedIn && styles.innerCircleChecked,
                        ]}
                    >
                        {isCheckedIn ? (
                            // 已簽到 - 顯示打勾圖標
                            <Animated.Text
                                style={[
                                    styles.checkIcon,
                                    {
                                        opacity: checkAnim,
                                        transform: [
                                            {
                                                scale: checkAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0.5, 1],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                ✓
                            </Animated.Text>
                        ) : (
                            // 未簽到 - 顯示笑臉
                            <Text style={styles.faceIcon}>😊</Text>
                        )}
                    </View>

                    {/* 狀態文字 */}
                    <Text style={[styles.statusText, isCheckedIn && styles.statusTextChecked]}>
                        {isCheckedIn ? '已簽到' : '今日簽到'}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulseRing: {
        position: 'absolute',
        width: CHECK_IN_BUTTON.size + 40,
        height: CHECK_IN_BUTTON.size + 40,
        borderRadius: (CHECK_IN_BUTTON.size + 40) / 2,
        backgroundColor: COLORS.primary,
    },
    button: {
        width: CHECK_IN_BUTTON.size,
        height: CHECK_IN_BUTTON.size,
        borderRadius: CHECK_IN_BUTTON.size / 2,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.lg,
    },
    buttonChecked: {
        backgroundColor: COLORS.gray300,
    },
    innerCircle: {
        width: CHECK_IN_BUTTON.innerSize,
        height: CHECK_IN_BUTTON.innerSize,
        borderRadius: CHECK_IN_BUTTON.innerSize / 2,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircleChecked: {
        backgroundColor: COLORS.gray200,
    },
    faceIcon: {
        fontSize: CHECK_IN_BUTTON.iconSize,
    },
    checkIcon: {
        fontSize: CHECK_IN_BUTTON.iconSize,
        color: COLORS.success,
        fontWeight: 'bold',
    },
    statusText: {
        position: 'absolute',
        bottom: SPACING.xl,
        color: COLORS.textOnPrimary,
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.semiBold as any,
    },
    statusTextChecked: {
        color: COLORS.textSecondary,
    },
});

export default CheckInButton;

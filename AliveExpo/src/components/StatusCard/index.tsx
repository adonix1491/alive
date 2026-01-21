/**
 * StatusCard - 狀態卡片元件
 * 用於顯示安全狀態、緊急聯絡人等資訊
 */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';

type CardVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface StatusCardProps {
    /** 卡片標題 */
    title: string;
    /** 卡片內容或副標題 */
    subtitle?: string;
    /** 卡片狀態變體 */
    variant?: CardVariant;
    /** 左側圖標 */
    icon?: React.ReactNode;
    /** 右側內容 */
    rightContent?: React.ReactNode;
    /** 點擊事件 */
    onPress?: () => void;
    /** 自訂樣式 */
    style?: ViewStyle;
    /** 子元件 */
    children?: React.ReactNode;
}

/**
 * 根據狀態變體獲取對應顏色
 */
const getVariantColors = (variant: CardVariant) => {
    switch (variant) {
        case 'success':
            return {
                background: '#E8F5E9',
                border: COLORS.success,
                text: COLORS.success,
            };
        case 'warning':
            return {
                background: '#FFF8E1',
                border: COLORS.warning,
                text: '#F57F17',
            };
        case 'danger':
            return {
                background: '#FFEBEE',
                border: COLORS.danger,
                text: COLORS.danger,
            };
        case 'info':
            return {
                background: '#E3F2FD',
                border: COLORS.info,
                text: '#1565C0',
            };
        default:
            return {
                background: COLORS.cardBackground,
                border: 'transparent',
                text: COLORS.textPrimary,
            };
    }
};

/**
 * 狀態卡片
 * @param title 卡片標題
 * @param subtitle 副標題或描述
 * @param variant 狀態變體
 * @param icon 左側圖標
 * @param rightContent 右側自訂內容
 * @param onPress 點擊回調
 * @param style 自訂樣式
 */
const StatusCard: React.FC<StatusCardProps> = ({
    title,
    subtitle,
    variant = 'default',
    icon,
    rightContent,
    onPress,
    style,
    children,
}) => {
    const colors = getVariantColors(variant);

    const CardWrapper = onPress ? TouchableOpacity : View;
    const cardProps = onPress ? { onPress, activeOpacity: 0.7 } : {};

    return (
        <CardWrapper
            {...cardProps}
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    borderLeftColor: colors.border,
                    borderLeftWidth: variant !== 'default' ? 4 : 0,
                },
                style,
            ]}
        >
            <View style={styles.content}>
                {/* 左側圖標 */}
                {icon && <View style={styles.iconContainer}>{icon}</View>}

                {/* 中間文字內容 */}
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                    {children}
                </View>

                {/* 右側內容 */}
                {rightContent && <View style={styles.rightContainer}>{rightContent}</View>}
            </View>
        </CardWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        ...SHADOWS.sm,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: SPACING.md,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.semiBold as any,
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: FONTS.size.md,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    rightContainer: {
        marginLeft: SPACING.md,
    },
});

export default StatusCard;

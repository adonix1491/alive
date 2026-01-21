/**
 * GradientBackground - 漸層背景元件
 * 提供一致的漸層背景樣式
 */
import React from 'react';
import {
    View,
    StyleSheet,
    ViewStyle,
    StatusBar,
} from 'react-native';
import { COLORS } from '../../theme';

interface GradientBackgroundProps {
    /** 子元件 */
    children: React.ReactNode;
    /** 自訂樣式 */
    style?: ViewStyle;
    /** 漸層類型 */
    variant?: 'primary' | 'light' | 'dark';
}

/**
 * 漸層背景容器
 * NOTE: 由於 React Native 原生不支援 CSS 漸層，
 *       這裡使用純色背景，後續可整合 react-native-linear-gradient
 * @param children 子元件
 * @param style 自訂樣式
 * @param variant 漸層變體
 */
const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    style,
    variant = 'primary',
}) => {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary':
                return COLORS.primary;
            case 'light':
                return COLORS.background;
            case 'dark':
                return COLORS.gray800;
            default:
                return COLORS.primary;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: getBackgroundColor() }, style]}>
            <StatusBar
                barStyle={variant === 'light' ? 'dark-content' : 'light-content'}
                backgroundColor="transparent"
                translucent
            />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default GradientBackground;

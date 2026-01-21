/**
 * ALIVE愛來 APP - 主題設計系統
 * 定義應用程式的色彩、字型、間距等設計規範
 */

// 色彩系統
export const COLORS = {
  // 主色調
  primary: '#00B894',
  primaryLight: '#55EFC4',
  primaryDark: '#00A884',

  // 漸層背景
  gradientStart: '#00B894',
  gradientMiddle: '#55EFC4',
  gradientEnd: '#81ECEC',

  // 狀態色彩
  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#E74C3C',
  info: '#74B9FF',

  // 中性色
  white: '#FFFFFF',
  black: '#2D3436',
  gray100: '#F8F9FA',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',

  // 背景色
  background: '#F0FFF4',
  backgroundDark: '#E8F5E9',
  cardBackground: '#FFFFFF',

  // 文字色
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  textLight: '#B2BEC3',
  textOnPrimary: '#FFFFFF',
};

// 字型系統
export const FONTS = {
  // 字重
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',

  // 字型大小
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    title: 28,
    display: 32,
    hero: 48,
  },

  // 行高
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

// 間距系統
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
};

// 圓角系統
export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 50,
  full: 9999,
};

// 陰影系統
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
};

// 動畫時間
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// 簽到按鈕尺寸
export const CHECK_IN_BUTTON = {
  size: 200,
  innerSize: 180,
  iconSize: 60,
};

export default {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
  ANIMATION,
  CHECK_IN_BUTTON,
};

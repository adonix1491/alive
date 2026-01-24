"use strict";
(self["webpackChunkAliveApp"] = self["webpackChunkAliveApp"] || []).push([[647],{

/***/ 7647
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ App_0)
});

// EXTERNAL MODULE: ./node_modules/react-native-gesture-handler/lib/module/index.js + 122 modules
var lib_module = __webpack_require__(334);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/StatusBar/index.js
var StatusBar = __webpack_require__(7576);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/View/index.js
var View = __webpack_require__(9176);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Text/index.js
var Text = __webpack_require__(8506);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/StyleSheet/index.js + 5 modules
var StyleSheet = __webpack_require__(3999);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/ActivityIndicator/index.js
var ActivityIndicator = __webpack_require__(2869);
// EXTERNAL MODULE: ./node_modules/@react-navigation/native/lib/module/index.js + 103 modules
var native_lib_module = __webpack_require__(7397);
// EXTERNAL MODULE: ./node_modules/@react-navigation/stack/src/navigators/createStackNavigator.tsx + 26 modules
var createStackNavigator = __webpack_require__(8589);
// EXTERNAL MODULE: ./node_modules/@react-navigation/bottom-tabs/lib/module/index.js + 14 modules
var bottom_tabs_lib_module = __webpack_require__(5973);
;// ./src/theme/index.ts
/**
 * ALIVE愛來 APP - 主題設計系統
 * 定義應用程式的色彩、字型、間距等設計規範
 */

// 色彩系統
const COLORS = {
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
  textOnPrimary: '#FFFFFF'
};

// 字型系統
const FONTS = {
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
    hero: 48
  },
  // 行高
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8
  }
};

// 間距系統
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64
};

// 圓角系統
const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 50,
  full: 9999
};

// 陰影系統
const SHADOWS = {
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8
  },
  xl: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16
  }
};

// 動畫時間
const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500
};

// 簽到按鈕尺寸
const CHECK_IN_BUTTON = {
  size: 200,
  innerSize: 180,
  iconSize: 60
};
/* harmony default export */ const theme = ({
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
  ANIMATION,
  CHECK_IN_BUTTON
});
;// ./src/constants/index.ts
/**
 * ALIVE愛來 APP - 應用程式常數配置
 */

// 應用程式基本資訊
const APP_INFO = {
  NAME: 'ALIVE愛來',
  VERSION: '1.0.0',
  BUILD_NUMBER: 1,
  SLOGAN: '每日一開，平安已達',
  DESCRIPTION: '讓關心您的人知道您平安'
};

// 預設簽到設定
const DEFAULT_CHECK_IN_SETTINGS = {
  INTERVAL_DAYS: 2,
  // 預設 2 天未簽到後通知
  GRACE_HOURS: 4,
  // 預設 4 小時寬限期
  REMINDER_TIME: '09:00' // 預設早上 9 點提醒
};

// 緊急聯絡人限制
const EMERGENCY_CONTACT_LIMITS = {
  MAX_CONTACTS: 5,
  // 最多 5 位緊急聯絡人
  MIN_CONTACTS: 1 // 至少需要 1 位
};

// 訊息模板預設內容
const DEFAULT_MESSAGE_TEMPLATES = {
  CHECK_IN: {
    title: '平安報到',
    content: '我是 [姓名]，我很好，今天已完成簽到。'
  },
  EMERGENCY: {
    title: '緊急提醒',
    content: '我是 [姓名]，我已經連續 [天數] 天沒有活動了，快來檢查下我的身體狀態。'
  },
  REMINDER: {
    title: '簽到提醒',
    content: '您今天還沒有簽到，請記得打開 ALIVE愛來 報平安。'
  }
};

// 通知渠道配置
const NOTIFICATION_CHANNELS = {
  LINE: {
    id: 'line',
    name: 'LINE Notify',
    icon: 'chatbubble-ellipses',
    description: '透過 LINE 接收通知'
  },
  EMAIL: {
    id: 'email',
    name: 'Email',
    icon: 'mail',
    description: '透過電子郵件接收通知'
  },
  SMS: {
    id: 'sms',
    name: '簡訊',
    icon: 'chatbox',
    description: '透過簡訊接收通知'
  },
  PUSH: {
    id: 'push',
    name: '推播通知',
    icon: 'notifications',
    description: '透過 APP 推播接收通知'
  }
};

// 本地儲存 Key
const STORAGE_KEYS = {
  USER_TOKEN: '@alive_user_token',
  USER_DATA: '@alive_user_data',
  CHECK_IN_SETTINGS: '@alive_checkin_settings',
  NOTIFICATION_SETTINGS: '@alive_notification_settings',
  LAST_CHECK_IN: '@alive_last_checkin',
  ONBOARDING_COMPLETED: '@alive_onboarding_completed'
};

// Firebase Collection 名稱
const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  CHECK_INS: 'check_ins',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  MESSAGE_TEMPLATES: 'message_templates',
  ANOMALY_RULES: 'anomaly_rules',
  NOTIFICATIONS: 'notifications'
};

// 應用程式路由名稱
const ROUTES = {
  SPLASH: 'Splash',
  AUTH: 'Auth',
  LOGIN: 'Login',
  REGISTER: 'Register',
  MAIN: 'Main',
  HOME: 'Home',
  SETTINGS: 'Settings',
  EMERGENCY_CONTACTS: 'EmergencyContacts',
  ADD_EMERGENCY_CONTACT: 'AddEmergencyContact',
  NOTIFICATION_SETTINGS: 'NotificationSettings',
  MESSAGE_TEMPLATES: 'MessageTemplates',
  ANOMALY_RULES: 'AnomalyRules',
  PROFILE: 'Profile'
};
/* harmony default export */ const constants = ({
  APP_INFO,
  DEFAULT_CHECK_IN_SETTINGS,
  EMERGENCY_CONTACT_LIMITS,
  DEFAULT_MESSAGE_TEMPLATES,
  NOTIFICATION_CHANNELS,
  STORAGE_KEYS,
  FIREBASE_COLLECTIONS,
  ROUTES
});
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/ScrollView/index.js + 1 modules
var ScrollView = __webpack_require__(4951);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/SafeAreaView/index.js
var SafeAreaView = __webpack_require__(8444);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/TouchableOpacity/index.js
var TouchableOpacity = __webpack_require__(6413);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Alert/index.js
var Alert = __webpack_require__(4081);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/TextInput/index.js
var TextInput = __webpack_require__(5782);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Modal/index.js + 4 modules
var Modal = __webpack_require__(6430);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/KeyboardAvoidingView/index.js
var KeyboardAvoidingView = __webpack_require__(5470);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Platform/index.js
var Platform = __webpack_require__(7862);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Animated/index.js + 45 modules
var Animated = __webpack_require__(8831);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
;// ./src/components/CheckInButton/index.tsx
/**
 * CheckInButton - 一鍵簽到按鈕元件
 * 核心簽到功能的主要互動元件，提供動態視覺反饋
 */








/**
 * 一鍵簽到按鈕
 * @param isCheckedIn 當前是否已完成簽到
 * @param onPress 點擊簽到時的回調
 * @param disabled 是否禁用按鈕
 * @param style 自訂容器樣式
 */
const CheckInButton = ({
  isCheckedIn,
  onPress,
  disabled = false,
  style
}) => {
  // 動畫值
  const scaleAnim = (0,react.useRef)(new Animated/* default */.A.Value(1)).current;
  const pulseAnim = (0,react.useRef)(new Animated/* default */.A.Value(1)).current;
  const checkAnim = (0,react.useRef)(new Animated/* default */.A.Value(isCheckedIn ? 1 : 0)).current;

  // 脈衝動畫效果（未簽到時）
  (0,react.useEffect)(() => {
    if (!isCheckedIn) {
      const pulse = Animated/* default */.A.loop(Animated/* default */.A.sequence([Animated/* default */.A.timing(pulseAnim, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true
      }), Animated/* default */.A.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      })]));
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isCheckedIn, pulseAnim]);

  // 簽到成功動畫
  (0,react.useEffect)(() => {
    Animated/* default */.A.timing(checkAnim, {
      toValue: isCheckedIn ? 1 : 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [isCheckedIn, checkAnim]);

  /**
   * 處理按下事件
   * 提供縮放的觸覺反饋
   */
  const handlePressIn = () => {
    Animated/* default */.A.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true
    }).start();
  };

  /**
   * 處理放開事件
   */
  const handlePressOut = () => {
    Animated/* default */.A.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true
    }).start();
  };
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
    style: [styles.container, style],
    children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.View, {
      style: [styles.pulseRing, {
        transform: [{
          scale: pulseAnim
        }],
        opacity: isCheckedIn ? 0 : 0.3
      }]
    }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
      activeOpacity: 0.9,
      onPress: onPress,
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
      disabled: disabled,
      children: /*#__PURE__*/(0,jsx_runtime.jsxs)(Animated/* default */.A.View, {
        style: [styles.button, isCheckedIn && styles.buttonChecked, {
          transform: [{
            scale: scaleAnim
          }]
        }],
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
          style: [styles.innerCircle, isCheckedIn && styles.innerCircleChecked],
          children: isCheckedIn ?
          /*#__PURE__*/
          // 已簽到 - 顯示打勾圖標
          (0,jsx_runtime.jsx)(Animated/* default */.A.Text, {
            style: [styles.checkIcon, {
              opacity: checkAnim,
              transform: [{
                scale: checkAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1]
                })
              }]
            }],
            children: "\u2713"
          }) :
          /*#__PURE__*/
          // 未簽到 - 顯示笑臉
          (0,jsx_runtime.jsx)(Text/* default */.A, {
            style: styles.faceIcon,
            children: "\uD83D\uDE0A"
          })
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: [styles.statusText, isCheckedIn && styles.statusTextChecked],
          children: isCheckedIn ? '已簽到' : '今日簽到'
        })]
      })
    })]
  });
};
const styles = StyleSheet/* default */.A.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  pulseRing: {
    position: 'absolute',
    width: CHECK_IN_BUTTON.size + 40,
    height: CHECK_IN_BUTTON.size + 40,
    borderRadius: (CHECK_IN_BUTTON.size + 40) / 2,
    backgroundColor: COLORS.primary
  },
  button: {
    width: CHECK_IN_BUTTON.size,
    height: CHECK_IN_BUTTON.size,
    borderRadius: CHECK_IN_BUTTON.size / 2,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg
  },
  buttonChecked: {
    backgroundColor: COLORS.gray300
  },
  innerCircle: {
    width: CHECK_IN_BUTTON.innerSize,
    height: CHECK_IN_BUTTON.innerSize,
    borderRadius: CHECK_IN_BUTTON.innerSize / 2,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerCircleChecked: {
    backgroundColor: COLORS.gray200
  },
  faceIcon: {
    fontSize: CHECK_IN_BUTTON.iconSize
  },
  checkIcon: {
    fontSize: CHECK_IN_BUTTON.iconSize,
    color: COLORS.success,
    fontWeight: 'bold'
  },
  statusText: {
    position: 'absolute',
    bottom: SPACING.xl,
    color: COLORS.textOnPrimary,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.semiBold
  },
  statusTextChecked: {
    color: COLORS.textSecondary
  }
});
/* harmony default export */ const components_CheckInButton = (CheckInButton);
;// ./src/components/StatusCard/index.tsx
/**
 * StatusCard - 狀態卡片元件
 * 用於顯示安全狀態、緊急聯絡人等資訊
 */







/**
 * 根據狀態變體獲取對應顏色
 */
const getVariantColors = variant => {
  switch (variant) {
    case 'success':
      return {
        background: '#E8F5E9',
        border: COLORS.success,
        text: COLORS.success
      };
    case 'warning':
      return {
        background: '#FFF8E1',
        border: COLORS.warning,
        text: '#F57F17'
      };
    case 'danger':
      return {
        background: '#FFEBEE',
        border: COLORS.danger,
        text: COLORS.danger
      };
    case 'info':
      return {
        background: '#E3F2FD',
        border: COLORS.info,
        text: '#1565C0'
      };
    default:
      return {
        background: COLORS.cardBackground,
        border: 'transparent',
        text: COLORS.textPrimary
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
const StatusCard = ({
  title,
  subtitle,
  variant = 'default',
  icon,
  rightContent,
  onPress,
  style,
  children
}) => {
  const colors = getVariantColors(variant);
  const CardWrapper = onPress ? TouchableOpacity/* default */.A : View/* default */.A;
  const cardProps = onPress ? {
    onPress,
    activeOpacity: 0.7
  } : {};
  return /*#__PURE__*/(0,jsx_runtime.jsx)(CardWrapper, {
    ...cardProps,
    style: [StatusCard_styles.container, {
      backgroundColor: colors.background,
      borderLeftColor: colors.border,
      borderLeftWidth: variant !== 'default' ? 4 : 0
    }, style],
    children: /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
      style: StatusCard_styles.content,
      children: [icon && /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
        style: StatusCard_styles.iconContainer,
        children: typeof icon === 'string' ? /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: {
            fontSize: 24
          },
          children: icon
        }) : icon
      }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: StatusCard_styles.textContainer,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: [StatusCard_styles.title, {
            color: colors.text
          }],
          children: title
        }), subtitle && /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: StatusCard_styles.subtitle,
          children: subtitle
        }), children]
      }), rightContent && /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
        style: StatusCard_styles.rightContainer,
        children: rightContent
      })]
    })
  });
};
const StatusCard_styles = StyleSheet/* default */.A.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    marginRight: SPACING.md
  },
  textContainer: {
    flex: 1
  },
  title: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary
  },
  subtitle: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs
  },
  rightContainer: {
    marginLeft: SPACING.md
  }
});
/* harmony default export */ const components_StatusCard = (StatusCard);
;// ./src/components/GradientBackground/index.tsx
/**
 * GradientBackground - 漸層背景元件
 * 提供一致的漸層背景樣式
 */






/**
 * 漸層背景容器
 * NOTE: 由於 React Native 原生不支援 CSS 漸層，
 *       這裡使用純色背景，後續可整合 react-native-linear-gradient
 * @param children 子元件
 * @param style 自訂樣式
 * @param variant 漸層變體
 */
const GradientBackground = ({
  children,
  style,
  variant = 'primary'
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
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
    style: [GradientBackground_styles.container, {
      backgroundColor: getBackgroundColor()
    }, style],
    children: [/*#__PURE__*/(0,jsx_runtime.jsx)(StatusBar/* default */.A, {
      barStyle: variant === 'light' ? 'dark-content' : 'light-content',
      backgroundColor: "transparent",
      translucent: true
    }), children]
  });
};
const GradientBackground_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  }
});
/* harmony default export */ const components_GradientBackground = (GradientBackground);
;// ./src/components/index.ts
/**
 * 元件統一匯出
 */



// EXTERNAL MODULE: ./node_modules/@react-native-async-storage/async-storage/lib/module/index.js + 3 modules
var async_storage_lib_module = __webpack_require__(2444);
;// ./src/services/api/config.ts
/**
 * API 配置
 * 統一管理 API 基礎設定
 */

// API 基礎 URL
// Web 環境使用相對路徑以避免 CORS 並自動適配網域
// Native 環境使用完整 URL
const API_BASE_URL =  false ? 0 : 'https://alive-iota.vercel.app/api';

// Token 儲存 key
const AUTH_TOKEN_KEY = '@alive_auth_token';

/**
 * API 錯誤類型
 */

/**
 * API 回應類型
 */

/**
 * 發送 API 請求的通用函數
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        error: data.error || {
          code: 'UNKNOWN_ERROR',
          message: '發生未知錯誤'
        }
      };
    }
    return {
      data
    };
  } catch (error) {
    return {
      error: {
        code: 'NETWORK_ERROR',
        message: '網路錯誤，請檢查連線',
        details: error.message
      }
    };
  }
}

/**
 * 發送需要認證的 API 請求
 */
async function authenticatedRequest(endpoint, token, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  });
}
;// ./src/services/api/authService.ts
/**
 * 認證服務
 * 處理用戶註冊、登入和認證相關功能
 */



/**
 * 用戶資料介面
 */

/**
 * 註冊參數
 */

/**
 * 更新個人資料參數
 */

/**
 * 登入參數
 */

/**
 * 認證回應
 */

class AuthService {
  /**
   * 用戶註冊
   */
  async register(params) {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params)
    });

    // 註冊成功後自動儲存 token
    if (response.data) {
      await this.saveToken(response.data.token);
    }
    return response;
  }

  /**
   * 用戶登入
   */
  async login(params) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params)
    });

    // 登入成功後自動儲存 token
    if (response.data) {
      await this.saveToken(response.data.token);
    }
    return response;
  }

  /**
   * 訪客登入 (手機號碼綁定)
   */
  async guestLogin(params) {
    const response = await apiRequest('/auth/guest-login', {
      method: 'POST',
      body: JSON.stringify(params)
    });

    // 登入成功後自動儲存 token
    if (response.data) {
      await this.saveToken(response.data.token);
    }
    return response;
  }

  /**
   * 取得當前使用者資訊
   */
  async getMe() {
    const token = await this.getToken();
    if (!token) {
      return {
        error: {
          code: 'NO_TOKEN',
          message: '未登入'
        }
      };
    }
    return authenticatedRequest('/auth/me', token, {
      method: 'GET'
    });
  }

  /**
   * 更新個人資料
   */
  async updateProfile(params) {
    const token = await this.getToken();
    if (!token) {
      return {
        error: {
          code: 'NO_TOKEN',
          message: '未登入'
        }
      };
    }
    return authenticatedRequest('/user/profile', token, {
      method: 'PUT',
      body: JSON.stringify(params)
    });
  }

  /**
   * 登出
   */
  async logout() {
    await async_storage_lib_module/* default */.A.removeItem(AUTH_TOKEN_KEY);
  }

  /**
   * 儲存 Token
   */
  async saveToken(token) {
    await async_storage_lib_module/* default */.A.setItem(AUTH_TOKEN_KEY, token);
  }

  /**
   * 取得 Token
   */
  async getToken() {
    return await async_storage_lib_module/* default */.A.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * 檢查是否已登入
   */
  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }
}
/* harmony default export */ const authService = (new AuthService());
;// ./src/services/api/checkinService.ts
/**
 * 簽到服務
 * 處理簽到記錄相關功能
 */



/**
 * 簽到記錄介面
 */

/**
 * 建立簽到參數
 */

/**
 * 簽到歷史回應
 */

class CheckInService {
  /**
   * 建立簽到
   */
  async createCheckIn(params) {
    const token = await authService.getToken();
    if (!token) {
      return {
        error: {
          code: 'NO_TOKEN',
          message: '未登入'
        }
      };
    }
    return authenticatedRequest('/checkin', token, {
      method: 'POST',
      body: JSON.stringify(params || {})
    });
  }

  // Helper for debug
  async getToken() {
    return authService.getToken();
  }

  /**
   * 取得簽到歷史
   */
  async getHistory(limit = 30, offset = 0) {
    const token = await authService.getToken();
    if (!token) {
      return {
        error: {
          code: 'NO_TOKEN',
          message: '未登入'
        }
      };
    }
    return authenticatedRequest(`/checkin/history?limit=${limit}&offset=${offset}`, token, {
      method: 'GET'
    });
  }
}
/* harmony default export */ const checkinService = (new CheckInService());
;// ./src/services/api/contactsService.ts
/**
 * 聯絡人服務
 * 處理緊急聯絡人 CRUD 功能
 */



/**
 * 緊急聯絡人介面
 */

/**
 * 新增聯絡人參數
 */

/**
 * 更新聯絡人參數
 */

class ContactsService {
  /**
   * 取得所有聯絡人
   */
  async getAll() {
    const token = await authService.getToken();
    if (!token) {
      return {
        error: {
          code: 'NO_TOKEN',
          message: '未登入'
        }
      };
    }
    return authenticatedRequest('/contacts', token, {
      method: 'GET'
    });
  }

  /**
   * 新增聯絡人
   */
  async create(params) {
    const token = await authService.getToken();
    if (!token) {
      return {
        error: {
          code: 'NO_TOKEN',
          message: '未登入'
        }
      };
    }
    return authenticatedRequest('/contacts', token, {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  /**
   * 更新聯絡人
   */
  async update(id, params) {
    const token = await authService.getToken();
    if (!token) {
      return {
        error: {
          code: 'NO_TOKEN',
          message: '未登入'
        }
      };
    }
    return authenticatedRequest(`/contacts/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(params)
    });
  }

  /**
   * 刪除聯絡人
   */
  async delete(id) {
    const token = await authService.getToken();
    if (!token) {
      return {
        error: {
          code: 'NO_TOKEN',
          message: '未登入'
        }
      };
    }
    return authenticatedRequest(`/contacts/${id}`, token, {
      method: 'DELETE'
    });
  }
}
/* harmony default export */ const contactsService = (new ContactsService());
;// ./src/services/api/notificationService.ts
/**
 * 通知服務
 * 處理通知設定和 Email 驗證
 */



/**
 * 通知設定介面
 */

/**
 * 更新設定參數
 */

class NotificationService {
  /**
   * 取得通知設定
   */
  async getSettings() {
    const token = await authService.getToken();
    if (!token) {
      return {
        error: {
          code: 'NO_TOKEN',
          message: '未登入'
        }
      };
    }
    return authenticatedRequest('/notifications/settings', token, {
      method: 'GET'
    });
  }

  /**
   * 更新通知設定
   */
  async updateSettings(params) {
    const token = await authService.getToken();
    if (!token) {
      return {
        error: {
          code: 'NO_TOKEN',
          message: '未登入'
        }
      };
    }
    return authenticatedRequest('/notifications/settings', token, {
      method: 'PUT',
      body: JSON.stringify(params)
    });
  }

  /**
   * 發送 Email 驗證碼
   */
  async sendEmailVerification(email) {
    const token = await authService.getToken();
    if (!token) {
      return {
        error: {
          code: 'NO_TOKEN',
          message: '未登入'
        }
      };
    }
    return authenticatedRequest('/notifications/verify-email', token, {
      method: 'POST',
      body: JSON.stringify({
        email
      })
    });
  }

  /**
   * 確認 Email 驗證碼
   */
  async confirmEmail(code) {
    const token = await authService.getToken();
    if (!token) {
      return {
        error: {
          code: 'NO_TOKEN',
          message: '未登入'
        }
      };
    }
    return authenticatedRequest('/notifications/confirm-email', token, {
      method: 'POST',
      body: JSON.stringify({
        code
      })
    });
  }
}
/* harmony default export */ const notificationService = (new NotificationService());
;// ./src/services/api/messageService.ts


const messageService = {
  /**
   * 獲取訊息模板
   */
  getTemplates: async () => {
    try {
      const token = await authService.getToken();
      if (!token) {
        return {
          error: {
            code: 'UNAUTHORIZED',
            message: '尚未登入'
          }
        };
      }
      return await authenticatedRequest('/message-templates', token, {
        method: 'GET'
      });
    } catch (error) {
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: error.message
        }
      };
    }
  },
  /**
   * 儲存訊息模板
   */
  saveTemplate: async params => {
    try {
      const token = await authService.getToken();
      if (!token) {
        return {
          error: {
            code: 'UNAUTHORIZED',
            message: '尚未登入'
          }
        };
      }
      return await authenticatedRequest('/message-templates', token, {
        method: 'POST',
        body: JSON.stringify(params)
      });
    } catch (error) {
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: error.message
        }
      };
    }
  }
};
/* harmony default export */ const api_messageService = (messageService);
;// ./src/services/api/index.ts
/**
 * API 服務統一導出
 * 方便其他模組導入使用
 */










;// ./src/contexts/AuthContext.tsx
/**
 * 認證 Context
 * 管理全域的登入狀態和使用者資訊
 */



const AuthContext = /*#__PURE__*/(0,react.createContext)(undefined);
const AuthProvider = ({
  children
}) => {
  const [user, setUser] = (0,react.useState)(null);
  const [isLoading, setIsLoading] = (0,react.useState)(true);

  // 檢查登入狀態
  (0,react.useEffect)(() => {
    checkAuth();
  }, []);
  const checkAuth = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const response = await authService.getMe();
        if (response.data) {
          setUser(response.data);
        }
      }
    } catch (error) {
      console.error('Check auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const login = async (email, password) => {
    try {
      const response = await authService.login({
        email,
        password
      });
      if (response.data) {
        setUser(response.data.user);
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: response.error?.message || '登入失敗'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || '登入失敗'
      };
    }
  };
  const register = async (email, password, name, phoneNumber) => {
    try {
      const response = await authService.register({
        email,
        password,
        name,
        phoneNumber
      });
      if (response.data) {
        setUser(response.data.user);
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: response.error?.message || '註冊失敗'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || '註冊失敗'
      };
    }
  };
  const guestLogin = async (phoneNumber, name) => {
    try {
      const response = await authService.guestLogin({
        phoneNumber,
        name
      });
      if (response.data) {
        setUser(response.data.user);
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: response.error?.message || '訪客登入失敗'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || '訪客登入失敗'
      };
    }
  };
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };
  const refreshUser = async () => {
    try {
      const response = await authService.getMe();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };
  return /*#__PURE__*/(0,jsx_runtime.jsx)(AuthContext.Provider, {
    value: {
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      register,
      guestLogin,
      logout,
      refreshUser
    },
    children: children
  });
};
const useAuth = () => {
  const context = (0,react.useContext)(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
;// ./src/screens/HomeScreen/index.tsx
/**
 * HomeScreen - 首頁
 * 顯示今日狀態、一鍵簽到按鈕、安全狀態等核心功能
 */



















/**
 * 首頁畫面
 * 核心功能：一鍵簽到、顯示安全狀態、緊急聯絡人資訊
 */
const HomeScreen = () => {
  const navigation = (0,native_lib_module.useNavigation)();
  const {
    user,
    guestLogin
  } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = (0,react.useState)(false);
  const [lastCheckInTime, setLastCheckInTime] = (0,react.useState)(null);
  const [isLoading, setIsLoading] = (0,react.useState)(false);
  const [guestPhone, setGuestPhone] = (0,react.useState)('');
  const [guestName, setGuestName] = (0,react.useState)('');
  const [debugToken, setDebugToken] = (0,react.useState)(null);
  const [isGuestModalVisible, setIsGuestModalVisible] = (0,react.useState)(false);
  react.useEffect(() => {
    checkinService.getToken().then(t => setDebugToken(t));
  }, [user]);

  /**
   * 檢查個人資料完整性
   * 簽到前必須確保用戶已綁定至少一種聯絡方式
   * return true = 通過檢查, false = 不通過
   */
  const checkProfileCompletion = (0,react.useCallback)(() => {
    // 1. 訪客檢查 (未登入)
    // 1. 訪客檢查 (未登入)
    // 1. 訪客檢查 (未登入) - 改為觸發 Modal
    if (!user) {
      setIsGuestModalVisible(true);
      return false;
    }

    // 2. 資料綁定檢查 (手機 或 Email 或 LINE ID)
    // 確保至少有一種聯絡方式
    const hasContactMethod = !!user.email || !!user.phoneNumber || !!user.lineId;

    // DEBUG: 打印檢查結果
    console.log('Profile Check:', {
      email: !!user.email,
      phone: !!user.phoneNumber,
      line: !!user.lineId,
      result: hasContactMethod
    });
    if (!hasContactMethod) {
      Alert/* default */.A.alert('需要綁定資料', `為了能夠完成簽到，請至少綁定一種聯絡方式：\n1. 手機號碼 ${user.phoneNumber ? '(已綁定)' : '(未綁定)'}\n2. Email ${user.email ? '(已綁定)' : '(未綁定)'}\n3. LINE ID ${user.lineId ? '(已綁定)' : '(未綁定)'}`, [{
        text: '稍後再說',
        style: 'cancel'
      }, {
        text: '前往設定頁',
        onPress: () => navigation.navigate('Profile')
      }]);
      return false;
    }
    return true;
  }, [user, navigation]);

  /**
   * 處理簽到動作
   * 使用真實 API 建立簽到記錄
   */
  const handleCheckIn = (0,react.useCallback)(async () => {
    // 先檢查資料完整性
    if (!checkProfileCompletion()) {
      return;
    }
    if (isCheckedIn) {
      Alert/* default */.A.alert('已簽到', '您今天已經完成簽到了！');
      return;
    }
    setIsLoading(true);
    try {
      // 呼叫簽到 API
      const response = await checkinService.createCheckIn();
      if (response.data) {
        setIsCheckedIn(true);
        setLastCheckInTime(new Date(response.data.checkIn.timestamp));
        Alert/* default */.A.alert('簽到成功！', '您的平安已記錄。', [{
          text: '確定',
          style: 'default'
        }]);
      } else {
        // 處理 403 資料不全錯誤
        if (response.error?.code === 'PROFILE_INCOMPLETE') {
          Alert/* default */.A.alert('資料未完善 (伺服器回應)', '簽到前請至少綁定一項聯絡方式 (手機、Email 或 LINE)，以確保緊急時刻能通知到您。', [{
            text: '稍後再說',
            style: 'cancel'
          }, {
            text: '前往綁定',
            onPress: () => navigation.navigate('Profile') // 或跳轉到 Profile 編輯 Modal
          }]);
        } else {
          Alert/* default */.A.alert('簽到失敗', `錯誤代碼: ${response.error?.code}\n訊息: ${response.error?.message}`, [{
            text: '確定',
            style: 'cancel'
          }]);
        }
      }
    } catch (err) {
      Alert/* default */.A.alert('發生例外錯誤', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isCheckedIn, checkProfileCompletion]);

  /**
   * 格式化時間顯示
   */
  const formatTime = date => {
    if (!date) return '尚未簽到';
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * 獲取當前日期字串
   */
  const getDateString = () => {
    const now = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return now.toLocaleDateString('zh-TW', options);
  };
  const handleGuestLogin = async () => {
    if (!guestPhone) {
      Alert/* default */.A.alert('提示', '請輸入手機號碼');
      return;
    }
    if (guestPhone.length < 8) {
      Alert/* default */.A.alert('提示', '請輸入有效的手機號碼');
      return;
    }
    setIsLoading(true);
    try {
      const result = await guestLogin(guestPhone, guestName);
      if (result.success) {
        // Login success, close modal and trigger check-in automatically
        setIsGuestModalVisible(false);
        setGuestPhone('');
        setGuestName('');
        Alert/* default */.A.alert('歡迎', '已自動登入！請再次點擊「簽到」按鈕以完成今日簽到。', [{
          text: '好',
          onPress: () => handleCheckIn()
        }]);
      } else {
        Alert/* default */.A.alert('登入失敗', result.error);
      }
    } catch (error) {
      Alert/* default */.A.alert('錯誤', '發生未預期的錯誤');
    } finally {
      setIsLoading(false);
    }
  };
  return /*#__PURE__*/(0,jsx_runtime.jsx)(components_GradientBackground, {
    variant: "light",
    children: /*#__PURE__*/(0,jsx_runtime.jsxs)(SafeAreaView/* default */.A, {
      style: HomeScreen_styles.container,
      children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: HomeScreen_styles.header,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: HomeScreen_styles.headerTitle,
          children: "\u4ECA\u65E5\u72C0\u614B"
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
          style: HomeScreen_styles.settingsButton,
          onPress: () => navigation.navigate('Profile'),
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: HomeScreen_styles.settingsIcon,
            children: "\u2699\uFE0F"
          })
        })]
      }), /*#__PURE__*/(0,jsx_runtime.jsxs)(ScrollView/* default */.A, {
        style: HomeScreen_styles.scrollView,
        contentContainerStyle: HomeScreen_styles.scrollContent,
        showsVerticalScrollIndicator: false,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: HomeScreen_styles.dateText,
          children: getDateString()
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: HomeScreen_styles.statusHint,
          children: isCheckedIn ? '今日已簽到，願您平安順心 ✨' : '系統將每日簽到記錄您的平安狀態'
        }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: HomeScreen_styles.checkInContainer,
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(components_CheckInButton, {
            isCheckedIn: isCheckedIn,
            onPress: handleCheckIn,
            disabled: isLoading
          }), lastCheckInTime && /*#__PURE__*/(0,jsx_runtime.jsxs)(Text/* default */.A, {
            style: HomeScreen_styles.lastCheckInText,
            children: ["\u6700\u5F8C\u7C3D\u5230\uFF1A", formatTime(lastCheckInTime)]
          })]
        }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: HomeScreen_styles.sloganContainer,
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: HomeScreen_styles.slogan,
            children: APP_INFO.SLOGAN
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: HomeScreen_styles.sloganEn,
            children: "Daily check-in, all is well"
          })]
        }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: HomeScreen_styles.cardsContainer,
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(components_StatusCard, {
            title: "\u5B89\u5168\u72C0\u614B",
            subtitle: isCheckedIn ? '狀態安全' : '待簽到',
            variant: isCheckedIn ? 'success' : 'warning',
            rightContent: /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
              style: [HomeScreen_styles.statusBadge, isCheckedIn ? HomeScreen_styles.statusBadgeSuccess : HomeScreen_styles.statusBadgeWarning],
              children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: HomeScreen_styles.statusBadgeText,
                children: isCheckedIn ? '✓' : '!'
              })
            }),
            style: HomeScreen_styles.card
          }), !user || !user.id ? /*#__PURE__*/(0,jsx_runtime.jsx)(components_StatusCard, {
            title: "\u8A2A\u5BA2\u6A21\u5F0F",
            subtitle: "\u5C1A\u672A\u555F\u7528 (\u9EDE\u64CA\u7C3D\u5230\u4EE5\u555F\u7528)",
            variant: "warning",
            onPress: () => setIsGuestModalVisible(true),
            rightContent: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: HomeScreen_styles.arrowIcon,
              children: "\u203A"
            }),
            style: HomeScreen_styles.card
          }) : /*#__PURE__*/(0,jsx_runtime.jsx)(components_StatusCard, {
            title: "\u7DCA\u6025\u806F\u7D61\u4EBA",
            subtitle: "\u7BA1\u7406\u806F\u7D61\u4EBA",
            variant: "danger",
            onPress: () => navigation.navigate('Profile'),
            rightContent: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: HomeScreen_styles.arrowIcon,
              children: "\u203A"
            }),
            style: HomeScreen_styles.card
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(components_StatusCard, {
            title: "\u6700\u8FD1\u63A8\u9001\u8A0A\u606F",
            subtitle: "\u4ECA\u5929 \xB7 \u7C3D\u5230\u63D0\u9192\u5DF2\u767C\u9001",
            variant: "info",
            style: HomeScreen_styles.card
          })]
        })]
      }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: HomeScreen_styles.footer,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: HomeScreen_styles.footerText,
          children: "\u591A\u65E5\u672A\u7C3D\u5230\uFF0C\u7CFB\u7D71\u5C07\u4EE5\u4F60\u7684\u540D\u7FA9\uFF0C\u7D66\u60A8\u8A2D\u5B9A\u7684\u7DCA\u6025\u806F\u7D61\u4EBA\u767C\u9001\u901A\u77E5"
        }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: HomeScreen_styles.footerLinks,
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
            children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: HomeScreen_styles.footerLink,
              children: "\u7528\u6236\u5354\u8B70"
            })
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: HomeScreen_styles.footerDivider,
            children: "\u548C"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
            children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: HomeScreen_styles.footerLink,
              children: "\u96B1\u79C1\u653F\u7B56"
            })
          })]
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: HomeScreen_styles.footerCopyright,
          children: "\xA9 2026 ALIVE. All rights reserved. (Build: 2026.01.23-LAZY-V1)"
        }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: {
            marginTop: 20,
            padding: 10,
            backgroundColor: '#eee',
            borderRadius: 8
          },
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: {
              fontWeight: 'bold'
            },
            children: "DEBUG INFO"
          }), /*#__PURE__*/(0,jsx_runtime.jsxs)(Text/* default */.A, {
            style: {
              fontSize: 10,
              fontFamily: 'monospace'
            },
            children: ["UID: ", user?.id || 'null', " | Name: ", user?.name || 'null']
          }), /*#__PURE__*/(0,jsx_runtime.jsxs)(Text/* default */.A, {
            style: {
              fontSize: 10,
              fontFamily: 'monospace'
            },
            children: ["Email: ", user?.email ? 'YES' : 'NO', " | Phone: ", user?.phoneNumber ? 'YES' : 'NO', " | Line: ", user?.lineId ? 'YES' : 'NO']
          }), /*#__PURE__*/(0,jsx_runtime.jsxs)(Text/* default */.A, {
            style: {
              fontSize: 10,
              fontFamily: 'monospace'
            },
            children: ["CheckIn: ", isCheckedIn ? 'TRUE' : 'FALSE', " | Token: ", debugToken ? 'YES' : 'NO']
          })]
        })]
      }), /*#__PURE__*/(0,jsx_runtime.jsx)(Modal/* default */.A, {
        visible: isGuestModalVisible,
        transparent: true,
        animationType: "slide",
        onRequestClose: () => setIsGuestModalVisible(false),
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(KeyboardAvoidingView/* default */.A, {
          behavior: Platform/* default */.A.OS === 'ios' ? 'padding' : 'height',
          style: HomeScreen_styles.modalOverlay,
          children: /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: HomeScreen_styles.modalContent,
            children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              style: HomeScreen_styles.modalHeader,
              children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: HomeScreen_styles.modalTitle,
                children: "\u8A2A\u5BA2\u5FEB\u901F\u7C3D\u5230"
              }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
                onPress: () => setIsGuestModalVisible(false),
                style: HomeScreen_styles.closeButton,
                children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: HomeScreen_styles.closeButtonText,
                  children: "\u2715"
                })
              })]
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: HomeScreen_styles.modalSubtitle,
              children: "\u8ACB\u8F38\u5165\u60A8\u7684\u624B\u6A5F\u865F\u78BC\u4EE5\u7D81\u5B9A\u8EAB\u4EFD\u3002\\n\u50C5\u9700\u8F38\u5165\u4E00\u6B21\uFF0C\u7CFB\u7D71\u5C07\u81EA\u52D5\u8A18\u9304\u3002"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: HomeScreen_styles.inputLabel,
              children: "\u624B\u6A5F\u865F\u78BC (\u5FC5\u586B)"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
              style: HomeScreen_styles.guestInput,
              placeholder: "\u4F8B\uFF1A0912345678",
              placeholderTextColor: COLORS.textLight,
              value: guestPhone,
              onChangeText: setGuestPhone,
              keyboardType: "phone-pad"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: HomeScreen_styles.inputLabel,
              children: "\u60A8\u7684\u7A31\u547C (\u9078\u586B)"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
              style: HomeScreen_styles.guestInput,
              placeholder: "\u4F8B\uFF1A\u9673\u5148\u751F/\u5C0F\u59D0",
              placeholderTextColor: COLORS.textLight,
              value: guestName,
              onChangeText: setGuestName
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
              style: HomeScreen_styles.guestButton,
              onPress: handleGuestLogin,
              disabled: isLoading,
              children: isLoading ? /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: HomeScreen_styles.guestButtonText,
                children: "\u8655\u7406\u4E2D..."
              }) : /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: HomeScreen_styles.guestButtonText,
                children: "\u78BA\u8A8D\u4E26\u7C3D\u5230"
              })
            })]
          })
        })
      })]
    })
  });
};
const HomeScreen_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md
  },
  headerTitle: {
    fontSize: FONTS.size.xxl,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary
  },
  settingsButton: {
    padding: SPACING.sm
  },
  settingsIcon: {
    fontSize: FONTS.size.xxl
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl
  },
  dateText: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm
  },
  statusHint: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl
  },
  checkInContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xxl
  },
  lastCheckInText: {
    marginTop: SPACING.lg,
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary
  },
  sloganContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl
  },
  slogan: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.medium,
    color: COLORS.primary,
    marginBottom: SPACING.xs
  },
  sloganEn: {
    fontSize: FONTS.size.sm,
    color: COLORS.textLight
  },
  cardsContainer: {
    gap: SPACING.md
  },
  card: {
    marginBottom: SPACING.md
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusBadgeSuccess: {
    backgroundColor: COLORS.success
  },
  statusBadgeWarning: {
    backgroundColor: COLORS.warning
  },
  statusBadgeText: {
    color: COLORS.white,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.bold
  },
  arrowIcon: {
    fontSize: FONTS.size.xxl,
    color: COLORS.textLight
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center'
  },
  footerText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.sm
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  footerLink: {
    fontSize: FONTS.size.xs,
    color: COLORS.primary
  },
  footerDivider: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    marginHorizontal: SPACING.xs
  },
  footerCopyright: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    fontWeight: 'bold'
  },
  guestFormCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md
  },
  guestFormTitle: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs
  },
  guestFormSubtitle: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md
  },
  guestInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    fontSize: FONTS.size.md,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    color: COLORS.textPrimary
  },
  guestButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm
  },
  guestButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.bold,
    fontSize: FONTS.size.md
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.lg
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.lg
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  modalTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary
  },
  modalSubtitle: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 20
  },
  closeButton: {
    padding: SPACING.xs
  },
  closeButtonText: {
    fontSize: FONTS.size.lg,
    color: COLORS.textLight
  },
  inputLabel: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm
  }
});
/* harmony default export */ const screens_HomeScreen = (HomeScreen);
;// ./src/screens/SettingsScreen/index.tsx
/**
 * SettingsScreen - 設置中心頁面
 * 管理簽到機制、緊急聯絡人、通知設定等
 */














/**
 * 設置中心頁面
 * 包含簽到機制設定、緊急聯絡人管理
 */

const SettingsScreen = () => {
  // 簽到機制設定 delay logic
  const [intervalDays, setIntervalDays] = (0,react.useState)(DEFAULT_CHECK_IN_SETTINGS.INTERVAL_DAYS.toString());

  // 緊急聯絡人資料
  const [contacts, setContacts] = (0,react.useState)([]);
  const [contactName, setContactName] = (0,react.useState)('');
  const [contactEmail, setContactEmail] = (0,react.useState)('');
  const [contactPhone, setContactPhone] = (0,react.useState)('');
  const [isLoading, setIsLoading] = (0,react.useState)(false);

  // 載入聯絡人
  react.useEffect(() => {
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
   * 新增聯絡人
   */
  const handleAddContact = async () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      Alert/* default */.A.alert('錯誤', '請輸入聯絡人姓名和電話');
      return;
    }
    if (contacts.length >= 5) {
      Alert/* default */.A.alert('限制', '最多只能新增 5 位緊急聯絡人');
      return;
    }
    setIsLoading(true);
    try {
      const result = await contactsService.create({
        name: contactName,
        phoneNumber: contactPhone,
        email: contactEmail,
        priority: contacts.length + 1
      });
      if (result.data) {
        Alert/* default */.A.alert('成功', '聯絡人已新增');
        setContactName('');
        setContactPhone('');
        setContactEmail('');
        loadContacts(); // Reload list
      } else {
        Alert/* default */.A.alert('失敗', result.error?.message || '新增失敗');
      }
    } catch (error) {
      Alert/* default */.A.alert('錯誤', '連線發生問題');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 刪除聯絡人
   */
  const handleDeleteContact = async id => {
    try {
      await contactsService.delete(id);
      Alert/* default */.A.alert('成功', '聯絡人已刪除');
      loadContacts();
    } catch (error) {
      Alert/* default */.A.alert('錯誤', '刪除失敗');
    }
  };
  return /*#__PURE__*/(0,jsx_runtime.jsx)(components_GradientBackground, {
    variant: "primary",
    children: /*#__PURE__*/(0,jsx_runtime.jsxs)(SafeAreaView/* default */.A, {
      style: SettingsScreen_styles.container,
      children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: SettingsScreen_styles.header,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
          style: SettingsScreen_styles.backButton,
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: SettingsScreen_styles.backIcon,
            children: "\u2190"
          })
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: SettingsScreen_styles.headerTitle,
          children: "\u8A2D\u7F6E\u4E2D\u5FC3"
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
          style: SettingsScreen_styles.placeholder
        })]
      }), /*#__PURE__*/(0,jsx_runtime.jsxs)(ScrollView/* default */.A, {
        style: SettingsScreen_styles.scrollView,
        contentContainerStyle: SettingsScreen_styles.scrollContent,
        showsVerticalScrollIndicator: false,
        children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: SettingsScreen_styles.section,
          children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: SettingsScreen_styles.sectionHeader,
            children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: SettingsScreen_styles.sectionIcon,
              children: "\u23F1\uFE0F"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: SettingsScreen_styles.sectionTitle,
              children: "\u7C3D\u5230\u6A5F\u5236"
            })]
          }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: SettingsScreen_styles.card,
            children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: SettingsScreen_styles.fieldLabel,
              children: "\u672A\u7C3D\u5230\u901A\u77E5\u5929\u6578"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
              style: SettingsScreen_styles.input,
              value: intervalDays,
              onChangeText: setIntervalDays,
              keyboardType: "numeric",
              placeholder: "\u8F38\u5165\u5929\u6578",
              placeholderTextColor: COLORS.textLight
            })]
          })]
        }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: SettingsScreen_styles.section,
          children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: SettingsScreen_styles.sectionHeader,
            children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: SettingsScreen_styles.sectionIcon,
              children: "\uD83D\uDC65"
            }), /*#__PURE__*/(0,jsx_runtime.jsxs)(Text/* default */.A, {
              style: SettingsScreen_styles.sectionTitle,
              children: ["\u5DF2\u5B58\u806F\u7D61\u4EBA (", contacts.length, "/5)"]
            })]
          }), contacts.map(contact => /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: SettingsScreen_styles.contactItem,
            children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: SettingsScreen_styles.contactName,
                children: contact.name
              }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: SettingsScreen_styles.contactPhone,
                children: contact.phoneNumber
              })]
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
              onPress: () => handleDeleteContact(contact.id),
              style: SettingsScreen_styles.deleteButton,
              children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: SettingsScreen_styles.deleteText,
                children: "\u522A\u9664"
              })
            })]
          }, contact.id))]
        }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: SettingsScreen_styles.section,
          children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: SettingsScreen_styles.sectionHeader,
            children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: SettingsScreen_styles.sectionIcon,
              children: "\u2795"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: SettingsScreen_styles.sectionTitle,
              children: "\u65B0\u589E\u806F\u7D61\u4EBA"
            })]
          }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: SettingsScreen_styles.card,
            children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              style: SettingsScreen_styles.field,
              children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: SettingsScreen_styles.fieldLabel,
                children: "\u59D3\u540D"
              }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
                style: SettingsScreen_styles.input,
                value: contactName,
                onChangeText: setContactName,
                placeholder: "\u59D3\u540D",
                placeholderTextColor: COLORS.textLight
              })]
            }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              style: SettingsScreen_styles.field,
              children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: SettingsScreen_styles.fieldLabel,
                children: "\u96FB\u8A71"
              }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
                style: SettingsScreen_styles.input,
                value: contactPhone,
                onChangeText: setContactPhone,
                placeholder: "\u96FB\u8A71",
                keyboardType: "phone-pad",
                placeholderTextColor: COLORS.textLight
              })]
            }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              style: SettingsScreen_styles.field,
              children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: SettingsScreen_styles.fieldLabel,
                children: "Email (\u9078\u586B)"
              }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
                style: SettingsScreen_styles.input,
                value: contactEmail,
                onChangeText: setContactEmail,
                placeholder: "Email",
                keyboardType: "email-address",
                placeholderTextColor: COLORS.textLight
              })]
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
              style: SettingsScreen_styles.saveButton,
              onPress: handleAddContact,
              disabled: isLoading,
              children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: SettingsScreen_styles.saveButtonText,
                children: isLoading ? '處理中...' : '新增聯絡人'
              })
            })]
          })]
        })]
      })]
    })
  });
};
const SettingsScreen_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg
  },
  backButton: {
    padding: SPACING.sm
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.white
  },
  headerTitle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold'
  },
  placeholder: {
    width: 40
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100
  },
  section: {
    marginBottom: SPACING.xl
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg
  },
  field: {
    marginBottom: SPACING.md
  },
  fieldLabel: {
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontSize: 12
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  saveButton: {
    backgroundColor: COLORS.black,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold'
  },
  contactItem: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333'
  },
  contactPhone: {
    fontSize: 14,
    color: '#666'
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4
  },
  deleteText: {
    color: 'white',
    fontSize: 12
  }
});
/* harmony default export */ const screens_SettingsScreen = (SettingsScreen);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/FlatList/index.js + 3 modules
var FlatList = __webpack_require__(7061);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Switch/index.js + 1 modules
var Switch = __webpack_require__(7043);
;// ./src/screens/EmergencyContactsScreen/index.tsx
/**
 * EmergencyContactsScreen - 緊急聯絡人管理頁面
 * 管理緊急聯絡人清單，支援新增、編輯、刪除
 */

















/**
 * 緊急聯絡人管理頁面
 */

const EmergencyContactsScreen = () => {
  const navigation = (0,native_lib_module.useNavigation)();
  const [contacts, setContacts] = (0,react.useState)([]);
  const [isLoading, setIsLoading] = (0,react.useState)(false);

  // Modal 狀態
  const [isModalVisible, setIsModalVisible] = (0,react.useState)(false);
  const [editingContact, setEditingContact] = (0,react.useState)(null);
  const [formName, setFormName] = (0,react.useState)('');
  const [formPhone, setFormPhone] = (0,react.useState)('');
  const [formLineId, setFormLineId] = (0,react.useState)('');
  const [isSubmitting, setIsSubmitting] = (0,react.useState)(false);

  // 載入聯絡人
  const loadContacts = (0,react.useCallback)(async () => {
    setIsLoading(true);
    try {
      const response = await contactsService.getAll();
      if (response.data) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
      Alert/* default */.A.alert('錯誤', '載入聯絡人失敗');
    } finally {
      setIsLoading(false);
    }
  }, []);
  (0,react.useEffect)(() => {
    loadContacts();
  }, [loadContacts]);

  /**
   * 切換聯絡人啟用狀態
   */
  const toggleContactEnabled = async contact => {
    // 樂觀更新
    const originalContacts = [...contacts];
    setContacts(prev => prev.map(c => c.id === contact.id ? {
      ...c,
      isEnabled: !c.isEnabled
    } : c));
    try {
      await contactsService.update(contact.id, {
        isEnabled: !contact.isEnabled
      });
    } catch (error) {
      // 還原狀態
      setContacts(originalContacts);
      Alert/* default */.A.alert('錯誤', '更新狀態失敗');
    }
  };

  /**
   * 刪除聯絡人
   */
  const handleDeleteContact = id => {
    Alert/* default */.A.alert('確認刪除', '確定要刪除此緊急聯絡人嗎？', [{
      text: '取消',
      style: 'cancel'
    }, {
      text: '刪除',
      style: 'destructive',
      onPress: async () => {
        try {
          setIsLoading(true);
          await contactsService.delete(id);
          // 重新載入列表
          await loadContacts();
        } catch (error) {
          Alert/* default */.A.alert('錯誤', '刪除失敗');
          setIsLoading(false);
        }
      }
    }]);
  };

  // 開啟新增模式
  const openAddModal = () => {
    setEditingContact(null);
    setFormName('');
    setFormPhone('');
    setFormLineId('');
    setIsModalVisible(true);
  };

  // 開啟編輯模式
  const openEditModal = contact => {
    setEditingContact(contact);
    setFormName(contact.name);
    setFormPhone(contact.phone);
    setFormLineId(contact.lineId || '');
    setIsModalVisible(true);
  };

  // 提交表單
  const handleSubmit = async () => {
    // 驗證邏輯：至少要有(電話) 或 (LINE ID)
    if (!formName.trim()) {
      Alert/* default */.A.alert('錯誤', '姓名為必填');
      return;
    }
    if (!formPhone.trim() && !formLineId.trim()) {
      Alert/* default */.A.alert('錯誤', '電話 或 LINE ID 請至少填寫這兩項之一');
      return;
    }
    setIsSubmitting(true);
    try {
      const contactData = {
        name: formName,
        phone: formPhone,
        lineId: formLineId
      };
      if (editingContact) {
        // 更新
        const response = await contactsService.update(editingContact.id, contactData);
        if (response.error) throw new Error(response.error.message);
      } else {
        // 新增
        const response = await contactsService.create({
          ...contactData,
          priority: contacts.length + 1
        });
        if (response.error) throw new Error(response.error.message);
      }
      setIsModalVisible(false);
      loadContacts();
    } catch (error) {
      Alert/* default */.A.alert('錯誤', error.message || '操作失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 渲染聯絡人項目
   */
  const renderContactItem = ({
    item
  }) => /*#__PURE__*/(0,jsx_runtime.jsxs)(TouchableOpacity/* default */.A, {
    style: EmergencyContactsScreen_styles.contactCard,
    onPress: () => openEditModal(item),
    activeOpacity: 0.7,
    children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
      style: EmergencyContactsScreen_styles.contactInfo,
      children: [/*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
        style: EmergencyContactsScreen_styles.contactIcon,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: EmergencyContactsScreen_styles.contactIconText,
          children: item.name.charAt(0)
        })
      }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: EmergencyContactsScreen_styles.contactDetails,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: EmergencyContactsScreen_styles.contactName,
          children: item.name
        }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: EmergencyContactsScreen_styles.contactMeta,
          children: [!!item.phone && /*#__PURE__*/(0,jsx_runtime.jsxs)(Text/* default */.A, {
            style: EmergencyContactsScreen_styles.contactPhone,
            children: ["\uD83D\uDCDE ", item.phone]
          }), !!item.lineId && /*#__PURE__*/(0,jsx_runtime.jsxs)(Text/* default */.A, {
            style: EmergencyContactsScreen_styles.contactLine,
            children: ["\uD83D\uDCAC ", item.lineId]
          })]
        }), !item.isEnabled && /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: EmergencyContactsScreen_styles.disabledLabel,
          children: "\u5DF2\u505C\u7528"
        })]
      })]
    }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
      style: EmergencyContactsScreen_styles.contactActions,
      children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Switch/* default */.A, {
        value: item.isEnabled,
        onValueChange: () => toggleContactEnabled(item),
        trackColor: {
          false: COLORS.gray300,
          true: COLORS.primaryLight
        },
        thumbColor: item.isEnabled ? COLORS.primary : COLORS.gray400
      }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
        style: EmergencyContactsScreen_styles.deleteButton,
        onPress: () => handleDeleteContact(item.id),
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: EmergencyContactsScreen_styles.deleteIcon,
          children: "\uD83D\uDDD1\uFE0F"
        })
      })]
    })]
  });
  return /*#__PURE__*/(0,jsx_runtime.jsx)(components_GradientBackground, {
    variant: "primary",
    children: /*#__PURE__*/(0,jsx_runtime.jsxs)(SafeAreaView/* default */.A, {
      style: EmergencyContactsScreen_styles.container,
      children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: EmergencyContactsScreen_styles.header,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
          style: EmergencyContactsScreen_styles.backButton,
          onPress: () => navigation.goBack(),
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: EmergencyContactsScreen_styles.backIcon,
            children: "\u2190"
          })
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: EmergencyContactsScreen_styles.headerTitle,
          children: "\u7DCA\u6025\u806F\u7D61\u4EBA"
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
          style: EmergencyContactsScreen_styles.addButton,
          onPress: openAddModal,
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: EmergencyContactsScreen_styles.addIcon,
            children: "\uFF0B"
          })
        })]
      }), isLoading && contacts.length === 0 ? /*#__PURE__*/(0,jsx_runtime.jsx)(ActivityIndicator/* default */.A, {
        size: "large",
        color: COLORS.white,
        style: {
          marginTop: 50
        }
      }) : /*#__PURE__*/(0,jsx_runtime.jsx)(FlatList/* default */.A, {
        data: contacts,
        renderItem: renderContactItem,
        keyExtractor: item => String(item.id),
        contentContainerStyle: EmergencyContactsScreen_styles.listContent,
        showsVerticalScrollIndicator: false,
        ListEmptyComponent: /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: EmergencyContactsScreen_styles.emptyContainer,
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: EmergencyContactsScreen_styles.emptyText,
            children: "\u5C1A\u672A\u8A2D\u5B9A\u7DCA\u6025\u806F\u7D61\u4EBA"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: EmergencyContactsScreen_styles.emptyHint,
            children: "\u9EDE\u64CA\u53F3\u4E0A\u89D2 \uFF0B \u6DFB\u52A0\u806F\u7D61\u4EBA"
          })]
        })
      }), /*#__PURE__*/(0,jsx_runtime.jsx)(Modal/* default */.A, {
        visible: isModalVisible,
        transparent: true,
        animationType: "fade",
        onRequestClose: () => setIsModalVisible(false),
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
          style: EmergencyContactsScreen_styles.modalOverlay,
          children: /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: EmergencyContactsScreen_styles.modalContainer,
            children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: EmergencyContactsScreen_styles.modalTitle,
              children: editingContact ? '編輯聯絡人' : '新增聯絡人'
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: EmergencyContactsScreen_styles.inputLabel,
              children: "\u59D3\u540D *"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
              style: EmergencyContactsScreen_styles.input,
              value: formName,
              onChangeText: setFormName,
              placeholder: "\u8ACB\u8F38\u5165\u59D3\u540D"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: EmergencyContactsScreen_styles.inputLabel,
              children: "\u96FB\u8A71"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
              style: EmergencyContactsScreen_styles.input,
              value: formPhone,
              onChangeText: setFormPhone,
              placeholder: "\u8ACB\u8F38\u5165\u96FB\u8A71\u865F\u78BC",
              keyboardType: "phone-pad"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: EmergencyContactsScreen_styles.inputLabel,
              children: "LINE ID"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
              style: EmergencyContactsScreen_styles.input,
              value: formLineId,
              onChangeText: setFormLineId,
              placeholder: "\u8ACB\u8F38\u5165 LINE ID (\u9078\u586B)",
              autoCapitalize: "none"
            }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              style: EmergencyContactsScreen_styles.modalButtons,
              children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
                style: [EmergencyContactsScreen_styles.modalButton, EmergencyContactsScreen_styles.cancelButton],
                onPress: () => setIsModalVisible(false),
                children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: EmergencyContactsScreen_styles.cancelButtonText,
                  children: "\u53D6\u6D88"
                })
              }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
                style: [EmergencyContactsScreen_styles.modalButton, EmergencyContactsScreen_styles.saveButton],
                onPress: handleSubmit,
                disabled: isSubmitting,
                children: isSubmitting ? /*#__PURE__*/(0,jsx_runtime.jsx)(ActivityIndicator/* default */.A, {
                  color: COLORS.white
                }) : /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: EmergencyContactsScreen_styles.saveButtonText,
                  children: "\u5132\u5B58"
                })
              })]
            })]
          })
        })
      })]
    })
  });
};
const EmergencyContactsScreen_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl
  },
  backButton: {
    padding: SPACING.sm
  },
  backIcon: {
    fontSize: FONTS.size.xxl,
    color: COLORS.white
  },
  headerTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.bold,
    color: COLORS.white
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.warning,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addIcon: {
    fontSize: FONTS.size.xl,
    color: COLORS.black,
    fontWeight: FONTS.bold
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md
  },
  contactIconText: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.bold,
    color: COLORS.white
  },
  contactDetails: {
    flex: 1
  },
  contactName: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary
  },
  contactMeta: {
    marginTop: SPACING.xs
  },
  contactPhone: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary
  },
  contactLine: {
    fontSize: FONTS.size.sm,
    color: COLORS.success,
    marginTop: 2
  },
  disabledLabel: {
    fontSize: FONTS.size.xs,
    color: COLORS.danger,
    marginTop: SPACING.xs
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md
  },
  deleteButton: {
    padding: SPACING.xs
  },
  deleteIcon: {
    fontSize: 18
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: SPACING.huge
  },
  emptyText: {
    fontSize: FONTS.size.lg,
    color: COLORS.white,
    marginBottom: SPACING.sm
  },
  emptyHint: {
    fontSize: FONTS.size.md,
    color: COLORS.gray300
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.lg
  },
  modalTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center'
  },
  inputLabel: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    fontSize: FONTS.size.md
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    gap: SPACING.md
  },
  modalButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: COLORS.gray100
  },
  saveButton: {
    backgroundColor: COLORS.primary
  },
  cancelButtonText: {
    color: COLORS.textPrimary,
    fontWeight: FONTS.medium
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.bold
  }
});
/* harmony default export */ const screens_EmergencyContactsScreen = (EmergencyContactsScreen);
;// ./src/screens/AuthScreen/index.tsx
/**
 * 登入/註冊畫面
 * 統一的認證介面
 */














const AuthScreen = () => {
  const {
    login,
    register
  } = useAuth();
  const [isLogin, setIsLogin] = (0,react.useState)(true);
  const [isLoading, setIsLoading] = (0,react.useState)(false);

  // 表單狀態
  const [email, setEmail] = (0,react.useState)('');
  const [password, setPassword] = (0,react.useState)('');
  const [name, setName] = (0,react.useState)('');
  const [phoneNumber, setPhoneNumber] = (0,react.useState)('');

  /**
   * 處理登入
   */
  const handleLogin = async () => {
    if (!email || !password) {
      Alert/* default */.A.alert('錯誤', '請輸入 Email 和密碼');
      return;
    }
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (!result.success) {
      Alert/* default */.A.alert('登入失敗', result.error || '請檢查您的帳號密碼');
    }
  };

  /**
   * 處理註冊
   */
  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert/* default */.A.alert('錯誤', '請填寫所有必填欄位');
      return;
    }
    if (password.length < 8) {
      Alert/* default */.A.alert('錯誤', '密碼必須至少 8 個字元');
      return;
    }
    setIsLoading(true);
    const result = await register(email, password, name, phoneNumber);
    setIsLoading(false);
    if (!result.success) {
      Alert/* default */.A.alert('註冊失敗', result.error || '請稍後再試');
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
  return /*#__PURE__*/(0,jsx_runtime.jsx)(KeyboardAvoidingView/* default */.A, {
    style: AuthScreen_styles.container,
    behavior: Platform/* default */.A.OS === 'ios' ? 'padding' : undefined,
    children: /*#__PURE__*/(0,jsx_runtime.jsxs)(ScrollView/* default */.A, {
      contentContainerStyle: AuthScreen_styles.scrollContent,
      children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: AuthScreen_styles.header,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: AuthScreen_styles.logo,
          children: "\uD83D\uDE0A"
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: AuthScreen_styles.title,
          children: "ALIVE \u611B\u4F86"
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: AuthScreen_styles.subtitle,
          children: "\u5B89\u5168\u7C3D\u5230\uFF0C\u5B88\u8B77\u5F7C\u6B64"
        })]
      }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: AuthScreen_styles.form,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: AuthScreen_styles.formTitle,
          children: isLogin ? '登入' : '註冊'
        }), !isLogin && /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
          style: AuthScreen_styles.input,
          placeholder: "\u59D3\u540D",
          value: name,
          onChangeText: setName,
          placeholderTextColor: COLORS.textSecondary
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
          style: AuthScreen_styles.input,
          placeholder: "Email",
          value: email,
          onChangeText: setEmail,
          keyboardType: "email-address",
          autoCapitalize: "none",
          placeholderTextColor: COLORS.textSecondary
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
          style: AuthScreen_styles.input,
          placeholder: "\u5BC6\u78BC\uFF08\u81F3\u5C11 8 \u500B\u5B57\u5143\uFF09",
          value: password,
          onChangeText: setPassword,
          secureTextEntry: true,
          placeholderTextColor: COLORS.textSecondary
        }), !isLogin && /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
          style: AuthScreen_styles.input,
          placeholder: "\u96FB\u8A71\uFF08\u9078\u586B\uFF09",
          value: phoneNumber,
          onChangeText: setPhoneNumber,
          keyboardType: "phone-pad",
          placeholderTextColor: COLORS.textSecondary
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
          style: [AuthScreen_styles.button, isLoading && AuthScreen_styles.buttonDisabled],
          onPress: isLogin ? handleLogin : handleRegister,
          disabled: isLoading,
          children: isLoading ? /*#__PURE__*/(0,jsx_runtime.jsx)(ActivityIndicator/* default */.A, {
            color: COLORS.white
          }) : /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: AuthScreen_styles.buttonText,
            children: isLogin ? '登入' : '註冊'
          })
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
          style: AuthScreen_styles.switchButton,
          onPress: toggleMode,
          children: /*#__PURE__*/(0,jsx_runtime.jsxs)(Text/* default */.A, {
            style: AuthScreen_styles.switchText,
            children: [isLogin ? '還沒有帳號？' : '已經有帳號？', /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: AuthScreen_styles.switchTextBold,
              children: isLogin ? ' 立即註冊' : ' 登入'
            })]
          })
        })]
      })]
    })
  });
};
const AuthScreen_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.xl
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl
  },
  logo: {
    fontSize: 80,
    marginBottom: SPACING.md
  },
  title: {
    fontSize: FONTS.size.xxl,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs
  },
  subtitle: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center'
  },
  formTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center'
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: FONTS.size.md,
    borderWidth: 1,
    borderColor: COLORS.gray200
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.semiBold
  },
  switchButton: {
    marginTop: SPACING.lg,
    alignItems: 'center'
  },
  switchText: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary
  },
  switchTextBold: {
    color: COLORS.primary,
    fontWeight: FONTS.semiBold
  }
});
;// ./src/screens/MessageTemplatesScreen/index.tsx
/**
 * MessageTemplatesScreen - 訊息模板設定
 * 讓用戶設定發送給緊急聯絡人的預設訊息和自訂訊息
 */















const MessageTemplatesScreen = () => {
  const navigation = (0,native_lib_module.useNavigation)();
  const [defaultMessage, setDefaultMessage] = (0,react.useState)('我長時間未簽到，可能發生意外，請嘗試聯繫我或協助確認我的安全。');
  const [customMessage, setCustomMessage] = (0,react.useState)('');
  const [isEditing, setIsEditing] = (0,react.useState)(false);
  const [isLoading, setIsLoading] = (0,react.useState)(false);
  const [isSaving, setIsSaving] = (0,react.useState)(false);

  // Load template on mount
  react.useEffect(() => {
    loadTemplate();
  }, []);
  const loadTemplate = async () => {
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await api_messageService.getTemplates();
      if (data?.templates) {
        const custom = data.templates.find(t => t.type === 'custom');
        if (custom) {
          setCustomMessage(custom.content);
        }
      } else if (error) {
        console.log('Load templates error:', error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSave = async () => {
    if (!customMessage.trim()) {
      Alert/* default */.A.alert('提示', '請輸入內容');
      return;
    }
    setIsSaving(true);
    const {
      data,
      error
    } = await api_messageService.saveTemplate({
      type: 'custom',
      content: customMessage.trim()
    });
    setIsSaving(false);
    if (data) {
      setIsEditing(false);
      Alert/* default */.A.alert('成功', '訊息模板已儲存');
    } else {
      Alert/* default */.A.alert('錯誤', error?.message || '儲存失敗');
    }
  };
  return /*#__PURE__*/(0,jsx_runtime.jsx)(components_GradientBackground, {
    variant: "light",
    children: /*#__PURE__*/(0,jsx_runtime.jsxs)(SafeAreaView/* default */.A, {
      style: MessageTemplatesScreen_styles.container,
      children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: MessageTemplatesScreen_styles.header,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
          style: MessageTemplatesScreen_styles.backButton,
          onPress: () => navigation.goBack(),
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: MessageTemplatesScreen_styles.backIcon,
            children: "\u2190"
          })
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: MessageTemplatesScreen_styles.headerTitle,
          children: "\u8A0A\u606F\u6A21\u677F"
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
          style: {
            width: 40
          }
        })]
      }), isLoading ? /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
        style: MessageTemplatesScreen_styles.loadingContainer,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(ActivityIndicator/* default */.A, {
          size: "large",
          color: COLORS.primary
        })
      }) : /*#__PURE__*/(0,jsx_runtime.jsxs)(ScrollView/* default */.A, {
        style: MessageTemplatesScreen_styles.content,
        children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: MessageTemplatesScreen_styles.section,
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: MessageTemplatesScreen_styles.sectionTitle,
            children: "\u9810\u8A2D\u901A\u77E5\u8A0A\u606F"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
            style: MessageTemplatesScreen_styles.card,
            children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: MessageTemplatesScreen_styles.messageText,
              children: defaultMessage
            })
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: MessageTemplatesScreen_styles.hintText,
            children: "\u6B64\u70BA\u7CFB\u7D71\u9810\u8A2D\u7684\u7DCA\u6025\u901A\u77E5\u5167\u5BB9\u3002"
          })]
        }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: MessageTemplatesScreen_styles.section,
          children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: MessageTemplatesScreen_styles.sectionHeader,
            children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: MessageTemplatesScreen_styles.sectionTitle,
              children: "\u81EA\u8A02\u901A\u77E5\u8A0A\u606F"
            }), !isEditing ? /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
              onPress: () => setIsEditing(true),
              children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: MessageTemplatesScreen_styles.editLink,
                children: "\u7DE8\u8F2F"
              })
            }) : /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
              onPress: handleSave,
              disabled: isSaving,
              children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: [MessageTemplatesScreen_styles.saveLink, isSaving && {
                  opacity: 0.5
                }],
                children: isSaving ? '儲存中...' : '完成'
              })
            })]
          }), isEditing ? /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
            style: MessageTemplatesScreen_styles.input,
            value: customMessage,
            onChangeText: setCustomMessage,
            multiline: true,
            placeholder: "\u8ACB\u8F38\u5165\u60A8\u60F3\u5C0D\u7DCA\u6025\u806F\u7D61\u4EBA\u8AAA\u7684\u8A71...",
            textAlignVertical: "top"
          }) : /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
            style: MessageTemplatesScreen_styles.card,
            children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: [MessageTemplatesScreen_styles.messageText, !customMessage && MessageTemplatesScreen_styles.placeholderText],
              children: customMessage || '點擊編輯以設定自訂訊息...'
            })
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: MessageTemplatesScreen_styles.hintText,
            children: "\u81EA\u8A02\u8A0A\u606F\u5C07\u9644\u52A0\u5728\u9810\u8A2D\u8A0A\u606F\u4E4B\u5F8C\u767C\u9001\u3002"
          })]
        })]
      })]
    })
  });
};
const MessageTemplatesScreen_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md
  },
  backButton: {
    padding: SPACING.sm
  },
  backIcon: {
    fontSize: FONTS.size.xxl,
    color: COLORS.textPrimary
  },
  headerTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary
  },
  content: {
    flex: 1,
    padding: SPACING.lg
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  section: {
    marginBottom: SPACING.xxl
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  sectionTitle: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm
  },
  messageText: {
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary,
    lineHeight: 24
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontStyle: 'italic'
  },
  hintText: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    height: 120,
    fontSize: FONTS.size.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    ...SHADOWS.sm
  },
  editLink: {
    color: COLORS.primary,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.bold
  },
  saveLink: {
    color: COLORS.success,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.bold
  }
});
/* harmony default export */ const screens_MessageTemplatesScreen = (MessageTemplatesScreen);
;// ./src/screens/NotificationSettingsScreen/index.tsx
/**
 * NotificationSettingsScreen - 通知設定頁面
 * 管理各通知渠道的綁定與設定
 */















/**
 * 通知設定頁面
 */
const NotificationSettingsScreen = () => {
  const [channels, setChannels] = (0,react.useState)([{
    id: 'push',
    name: NOTIFICATION_CHANNELS.PUSH.name,
    icon: '🔔',
    description: NOTIFICATION_CHANNELS.PUSH.description,
    enabled: true,
    verified: true
  }, {
    id: 'email',
    name: NOTIFICATION_CHANNELS.EMAIL.name,
    icon: '📧',
    description: NOTIFICATION_CHANNELS.EMAIL.description,
    enabled: false,
    verified: false,
    value: ''
  }, {
    id: 'line',
    name: NOTIFICATION_CHANNELS.LINE.name,
    icon: '💚',
    description: NOTIFICATION_CHANNELS.LINE.description,
    enabled: false,
    verified: false
  }, {
    id: 'sms',
    name: NOTIFICATION_CHANNELS.SMS.name,
    icon: '💬',
    description: NOTIFICATION_CHANNELS.SMS.description,
    enabled: false,
    verified: false,
    value: ''
  }]);
  const [isEmailModalVisible, setIsEmailModalVisible] = (0,react.useState)(false);
  const [isPhoneModalVisible, setIsPhoneModalVisible] = (0,react.useState)(false);
  const [emailInput, setEmailInput] = (0,react.useState)('');
  const [phoneInput, setPhoneInput] = (0,react.useState)('');

  /**
   * 切換通知渠道
   */
  const toggleChannel = channelId => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel) return;

    // 如果渠道未驗證，需要先進行設定
    if (!channel.verified && !channel.enabled) {
      switch (channelId) {
        case 'email':
          setIsEmailModalVisible(true);
          return;
        case 'sms':
          setIsPhoneModalVisible(true);
          return;
        case 'line':
          handleLineConnect();
          return;
        default:
          break;
      }
    }

    // 更新狀態
    setChannels(prev => prev.map(c => c.id === channelId ? {
      ...c,
      enabled: !c.enabled
    } : c));
  };

  /**
   * 處理 LINE 連接
   */
  const handleLineConnect = async () => {
    Alert/* default */.A.alert('連接 LINE Notify', '將開啟 LINE 授權頁面，完成後即可接收通知。', [{
      text: '取消',
      style: 'cancel'
    }, {
      text: '前往連接',
      onPress: async () => {
        // TODO: 實作 LINE Notify OAuth
        // 模擬成功連接
        setChannels(prev => prev.map(c => c.id === 'line' ? {
          ...c,
          enabled: true,
          verified: true
        } : c));
        Alert/* default */.A.alert('成功', 'LINE Notify 已連接');
      }
    }]);
  };

  /**
   * 儲存 Email 設定
   */
  const handleSaveEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      Alert/* default */.A.alert('錯誤', '請輸入有效的電子郵箱地址');
      return;
    }
    setChannels(prev => prev.map(c => c.id === 'email' ? {
      ...c,
      value: emailInput,
      verified: true,
      enabled: true
    } : c));
    setIsEmailModalVisible(false);
    Alert/* default */.A.alert('成功', '電子郵箱已設定，驗證郵件已發送');
  };

  /**
   * 儲存電話設定
   */
  const handleSavePhone = () => {
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phoneInput)) {
      Alert/* default */.A.alert('錯誤', '請輸入有效的手機號碼（09XXXXXXXX）');
      return;
    }
    setChannels(prev => prev.map(c => c.id === 'sms' ? {
      ...c,
      value: phoneInput,
      verified: true,
      enabled: true
    } : c));
    setIsPhoneModalVisible(false);
    Alert/* default */.A.alert('成功', '簡訊通知已設定');
  };

  /**
   * 取消綁定
   */
  const handleDisconnect = channelId => {
    Alert/* default */.A.alert('確認取消綁定', '取消綁定後將無法透過此渠道接收通知，確定要繼續嗎？', [{
      text: '取消',
      style: 'cancel'
    }, {
      text: '確定',
      style: 'destructive',
      onPress: () => {
        setChannels(prev => prev.map(c => c.id === channelId ? {
          ...c,
          enabled: false,
          verified: false,
          value: ''
        } : c));
      }
    }]);
  };

  /**
   * 遮蔽顯示敏感資訊
   */
  const maskValue = (value, type) => {
    if (!value) return '';
    if (type === 'email') {
      const [name, domain] = value.split('@');
      if (name.length <= 3) return `${name[0]}***@${domain}`;
      return `${name.slice(0, 3)}***@${domain}`;
    }
    return value.replace(/(\d{4})(\d{3})(\d{3})/, '$1****$3');
  };

  /**
   * 渲染通知渠道卡片
   */
  const renderChannelCard = channel => /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
    style: NotificationSettingsScreen_styles.channelCard,
    children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
      style: NotificationSettingsScreen_styles.channelHeader,
      children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
        style: NotificationSettingsScreen_styles.channelIcon,
        children: channel.icon
      }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: NotificationSettingsScreen_styles.channelInfo,
        children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: NotificationSettingsScreen_styles.channelTitleRow,
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: NotificationSettingsScreen_styles.channelName,
            children: channel.name
          }), channel.verified && /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
            style: NotificationSettingsScreen_styles.verifiedBadge,
            children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: NotificationSettingsScreen_styles.verifiedText,
              children: "\u5DF2\u9A57\u8B49"
            })
          })]
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: NotificationSettingsScreen_styles.channelDesc,
          children: channel.description
        }), channel.value && /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: NotificationSettingsScreen_styles.channelValue,
          children: maskValue(channel.value, channel.id === 'email' ? 'email' : 'phone')
        })]
      }), /*#__PURE__*/(0,jsx_runtime.jsx)(Switch/* default */.A, {
        value: channel.enabled,
        onValueChange: () => toggleChannel(channel.id),
        trackColor: {
          false: COLORS.gray300,
          true: COLORS.primaryLight
        },
        thumbColor: channel.enabled ? COLORS.primary : COLORS.gray400
      })]
    }), channel.verified && channel.id !== 'push' && /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
      style: NotificationSettingsScreen_styles.disconnectButton,
      onPress: () => handleDisconnect(channel.id),
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
        style: NotificationSettingsScreen_styles.disconnectText,
        children: "\u53D6\u6D88\u7D81\u5B9A"
      })
    })]
  }, channel.id);
  return /*#__PURE__*/(0,jsx_runtime.jsx)(components_GradientBackground, {
    variant: "light",
    children: /*#__PURE__*/(0,jsx_runtime.jsxs)(SafeAreaView/* default */.A, {
      style: NotificationSettingsScreen_styles.container,
      children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: NotificationSettingsScreen_styles.header,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
          style: NotificationSettingsScreen_styles.backButton,
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: NotificationSettingsScreen_styles.backIcon,
            children: "\u2190"
          })
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: NotificationSettingsScreen_styles.headerTitle,
          children: "\u901A\u77E5\u8A2D\u5B9A"
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
          style: NotificationSettingsScreen_styles.placeholder
        })]
      }), /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
        style: NotificationSettingsScreen_styles.infoContainer,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: NotificationSettingsScreen_styles.infoText,
          children: "\u9078\u64C7\u60A8\u5E0C\u671B\u63A5\u6536\u901A\u77E5\u7684\u6E20\u9053\u3002\u7576\u7DCA\u6025\u806F\u7D61\u4EBA\u9700\u8981\u88AB\u901A\u77E5\u6642\uFF0C\u7CFB\u7D71\u5C07\u900F\u904E\u9019\u4E9B\u6E20\u9053\u767C\u9001\u8A0A\u606F\u3002"
        })
      }), /*#__PURE__*/(0,jsx_runtime.jsxs)(ScrollView/* default */.A, {
        style: NotificationSettingsScreen_styles.scrollView,
        contentContainerStyle: NotificationSettingsScreen_styles.scrollContent,
        showsVerticalScrollIndicator: false,
        children: [channels.map(renderChannelCard), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: NotificationSettingsScreen_styles.noticeContainer,
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: NotificationSettingsScreen_styles.noticeTitle,
            children: "\uD83D\uDCCC \u6CE8\u610F\u4E8B\u9805"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: NotificationSettingsScreen_styles.noticeText,
            children: "\u2022 \u5EFA\u8B70\u81F3\u5C11\u555F\u7528\u5169\u7A2E\u901A\u77E5\u6E20\u9053\u4EE5\u78BA\u4FDD\u8A0A\u606F\u9001\u9054"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: NotificationSettingsScreen_styles.noticeText,
            children: "\u2022 LINE Notify \u6BCF\u6708\u6709\u767C\u9001\u6578\u91CF\u9650\u5236"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: NotificationSettingsScreen_styles.noticeText,
            children: "\u2022 \u7C21\u8A0A\u901A\u77E5\u53EF\u80FD\u7522\u751F\u984D\u5916\u8CBB\u7528"
          })]
        })]
      }), /*#__PURE__*/(0,jsx_runtime.jsx)(Modal/* default */.A, {
        visible: isEmailModalVisible,
        animationType: "slide",
        transparent: true,
        onRequestClose: () => setIsEmailModalVisible(false),
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
          style: NotificationSettingsScreen_styles.modalOverlay,
          children: /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: NotificationSettingsScreen_styles.modalContent,
            children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: NotificationSettingsScreen_styles.modalTitle,
              children: "\u8A2D\u5B9A\u96FB\u5B50\u90F5\u7BB1"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: NotificationSettingsScreen_styles.modalDesc,
              children: "\u8ACB\u8F38\u5165\u7528\u65BC\u63A5\u6536\u901A\u77E5\u7684\u96FB\u5B50\u90F5\u7BB1\u5730\u5740"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
              style: NotificationSettingsScreen_styles.modalInput,
              value: emailInput,
              onChangeText: setEmailInput,
              placeholder: "example@email.com",
              placeholderTextColor: COLORS.textLight,
              keyboardType: "email-address",
              autoCapitalize: "none"
            }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              style: NotificationSettingsScreen_styles.modalButtons,
              children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
                style: NotificationSettingsScreen_styles.cancelButton,
                onPress: () => setIsEmailModalVisible(false),
                children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: NotificationSettingsScreen_styles.cancelButtonText,
                  children: "\u53D6\u6D88"
                })
              }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
                style: NotificationSettingsScreen_styles.confirmButton,
                onPress: handleSaveEmail,
                children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: NotificationSettingsScreen_styles.confirmButtonText,
                  children: "\u78BA\u8A8D"
                })
              })]
            })]
          })
        })
      }), /*#__PURE__*/(0,jsx_runtime.jsx)(Modal/* default */.A, {
        visible: isPhoneModalVisible,
        animationType: "slide",
        transparent: true,
        onRequestClose: () => setIsPhoneModalVisible(false),
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
          style: NotificationSettingsScreen_styles.modalOverlay,
          children: /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: NotificationSettingsScreen_styles.modalContent,
            children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: NotificationSettingsScreen_styles.modalTitle,
              children: "\u8A2D\u5B9A\u624B\u6A5F\u865F\u78BC"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: NotificationSettingsScreen_styles.modalDesc,
              children: "\u8ACB\u8F38\u5165\u7528\u65BC\u63A5\u6536\u7C21\u8A0A\u901A\u77E5\u7684\u624B\u6A5F\u865F\u78BC"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
              style: NotificationSettingsScreen_styles.modalInput,
              value: phoneInput,
              onChangeText: setPhoneInput,
              placeholder: "0912345678",
              placeholderTextColor: COLORS.textLight,
              keyboardType: "phone-pad",
              maxLength: 10
            }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              style: NotificationSettingsScreen_styles.modalButtons,
              children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
                style: NotificationSettingsScreen_styles.cancelButton,
                onPress: () => setIsPhoneModalVisible(false),
                children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: NotificationSettingsScreen_styles.cancelButtonText,
                  children: "\u53D6\u6D88"
                })
              }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
                style: NotificationSettingsScreen_styles.confirmButton,
                onPress: handleSavePhone,
                children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: NotificationSettingsScreen_styles.confirmButtonText,
                  children: "\u78BA\u8A8D"
                })
              })]
            })]
          })
        })
      })]
    })
  });
};
const NotificationSettingsScreen_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md
  },
  backButton: {
    padding: SPACING.sm
  },
  backIcon: {
    fontSize: FONTS.size.xxl,
    color: COLORS.textPrimary
  },
  headerTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary
  },
  placeholder: {
    width: 40
  },
  infoContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg
  },
  infoText: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    lineHeight: FONTS.size.sm * 1.5
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl
  },
  channelCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  channelIcon: {
    fontSize: 28,
    marginRight: SPACING.md
  },
  channelInfo: {
    flex: 1
  },
  channelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  channelName: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm
  },
  verifiedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm
  },
  verifiedText: {
    fontSize: FONTS.size.xs,
    color: COLORS.white
  },
  channelDesc: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs
  },
  channelValue: {
    fontSize: FONTS.size.sm,
    color: COLORS.primary,
    marginTop: SPACING.xs
  },
  disconnectButton: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    alignItems: 'center'
  },
  disconnectText: {
    fontSize: FONTS.size.sm,
    color: COLORS.danger
  },
  noticeContainer: {
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg
  },
  noticeTitle: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm
  },
  noticeText: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    lineHeight: FONTS.size.sm * 1.5
  },
  // Modal 樣式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%'
  },
  modalTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm
  },
  modalDesc: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.size.lg,
    color: COLORS.textPrimary,
    textAlign: 'center'
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    gap: SPACING.md
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    alignItems: 'center'
  },
  cancelButtonText: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary
  },
  confirmButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center'
  },
  confirmButtonText: {
    fontSize: FONTS.size.md,
    color: COLORS.white,
    fontWeight: FONTS.semiBold
  }
});
/* harmony default export */ const screens_NotificationSettingsScreen = (NotificationSettingsScreen);
;// ./src/screens/AnomalyRulesScreen/index.tsx
/**
 * AnomalyRulesScreen - 異常規則管理頁面
 * 設定觸發通知的異常條件
 */














// 預設異常規則
const DEFAULT_RULES = [{
  id: 'rule_1',
  userId: 'current_user',
  name: '連續未簽到 2 天',
  description: '當連續 2 天未簽到時，通知所有緊急聯絡人',
  condition: {
    type: 'missed_checkin',
    days: 2
  },
  isEnabled: true,
  notifyContacts: ['all'],
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: 'rule_2',
  userId: 'current_user',
  name: '連續未簽到 7 天',
  description: '當連續 7 天未簽到時，發送緊急警報',
  condition: {
    type: 'missed_checkin',
    days: 7
  },
  isEnabled: false,
  notifyContacts: ['all'],
  createdAt: new Date(),
  updatedAt: new Date()
}];

/**
 * 異常規則管理頁面
 */
const AnomalyRulesScreen = () => {
  const [rules, setRules] = (0,react.useState)(DEFAULT_RULES);
  const [isModalVisible, setIsModalVisible] = (0,react.useState)(false);
  const [editingRule, setEditingRule] = (0,react.useState)(null);
  const [ruleName, setRuleName] = (0,react.useState)('');
  const [ruleDays, setRuleDays] = (0,react.useState)('');

  /**
   * 切換規則啟用狀態
   */
  const toggleRule = ruleId => {
    setRules(prev => prev.map(rule => rule.id === ruleId ? {
      ...rule,
      isEnabled: !rule.isEnabled
    } : rule));
  };

  /**
   * 開啟新增模態框
   */
  const openAddModal = () => {
    setEditingRule(null);
    setRuleName('');
    setRuleDays('');
    setIsModalVisible(true);
  };

  /**
   * 開啟編輯模態框
   */
  const openEditModal = rule => {
    setEditingRule(rule);
    setRuleName(rule.name);
    setRuleDays(rule.condition.days?.toString() || '');
    setIsModalVisible(true);
  };

  /**
   * 關閉模態框
   */
  const closeModal = () => {
    setIsModalVisible(false);
    setEditingRule(null);
    setRuleName('');
    setRuleDays('');
  };

  /**
   * 儲存規則
   */
  const handleSave = () => {
    const days = parseInt(ruleDays, 10);
    if (!ruleName.trim()) {
      Alert/* default */.A.alert('錯誤', '請輸入規則名稱');
      return;
    }
    if (isNaN(days) || days < 1 || days > 30) {
      Alert/* default */.A.alert('錯誤', '天數必須在 1-30 之間');
      return;
    }
    if (editingRule) {
      // 編輯現有規則
      setRules(prev => prev.map(rule => rule.id === editingRule.id ? {
        ...rule,
        name: ruleName,
        description: `當連續 ${days} 天未簽到時，通知所有緊急聯絡人`,
        condition: {
          type: 'missed_checkin',
          days
        },
        updatedAt: new Date()
      } : rule));
    } else {
      // 新增規則
      const newRule = {
        id: `rule_${Date.now()}`,
        userId: 'current_user',
        name: ruleName,
        description: `當連續 ${days} 天未簽到時，通知所有緊急聯絡人`,
        condition: {
          type: 'missed_checkin',
          days
        },
        isEnabled: true,
        notifyContacts: ['all'],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setRules(prev => [...prev, newRule]);
    }
    closeModal();
    Alert/* default */.A.alert('成功', '異常規則已儲存');
  };

  /**
   * 刪除規則
   */
  const handleDelete = rule => {
    Alert/* default */.A.alert('確認刪除', `確定要刪除「${rule.name}」嗎？`, [{
      text: '取消',
      style: 'cancel'
    }, {
      text: '刪除',
      style: 'destructive',
      onPress: () => {
        setRules(prev => prev.filter(r => r.id !== rule.id));
      }
    }]);
  };

  /**
   * 渲染規則卡片
   */
  const renderRuleCard = rule => /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
    style: AnomalyRulesScreen_styles.ruleCard,
    children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
      style: AnomalyRulesScreen_styles.ruleContent,
      onPress: () => openEditModal(rule),
      activeOpacity: 0.7,
      children: /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: AnomalyRulesScreen_styles.ruleHeader,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
          style: AnomalyRulesScreen_styles.ruleIcon,
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: AnomalyRulesScreen_styles.ruleIconText,
            children: "\u26A0\uFE0F"
          })
        }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: AnomalyRulesScreen_styles.ruleInfo,
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: AnomalyRulesScreen_styles.ruleName,
            children: rule.name
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: AnomalyRulesScreen_styles.ruleDesc,
            children: rule.description
          })]
        })]
      })
    }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
      style: AnomalyRulesScreen_styles.ruleActions,
      children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Switch/* default */.A, {
        value: rule.isEnabled,
        onValueChange: () => toggleRule(rule.id),
        trackColor: {
          false: COLORS.gray300,
          true: COLORS.primaryLight
        },
        thumbColor: rule.isEnabled ? COLORS.primary : COLORS.gray400
      }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
        style: AnomalyRulesScreen_styles.deleteButton,
        onPress: () => handleDelete(rule),
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: AnomalyRulesScreen_styles.deleteIcon,
          children: "\uD83D\uDDD1\uFE0F"
        })
      })]
    })]
  }, rule.id);
  return /*#__PURE__*/(0,jsx_runtime.jsx)(components_GradientBackground, {
    variant: "light",
    children: /*#__PURE__*/(0,jsx_runtime.jsxs)(SafeAreaView/* default */.A, {
      style: AnomalyRulesScreen_styles.container,
      children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: AnomalyRulesScreen_styles.header,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
          style: AnomalyRulesScreen_styles.backButton,
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: AnomalyRulesScreen_styles.backIcon,
            children: "\u2190"
          })
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: AnomalyRulesScreen_styles.headerTitle,
          children: "\u7570\u5E38\u898F\u5247"
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
          style: AnomalyRulesScreen_styles.addButton,
          onPress: openAddModal,
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: AnomalyRulesScreen_styles.addIcon,
            children: "\uFF0B"
          })
        })]
      }), /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
        style: AnomalyRulesScreen_styles.infoContainer,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: AnomalyRulesScreen_styles.infoText,
          children: "\u8A2D\u5B9A\u89F8\u767C\u7DCA\u6025\u901A\u77E5\u7684\u689D\u4EF6\u3002\u7576\u7B26\u5408\u898F\u5247\u689D\u4EF6\u6642\uFF0C\u7CFB\u7D71\u6703\u81EA\u52D5\u901A\u77E5\u60A8\u7684\u7DCA\u6025\u806F\u7D61\u4EBA\u3002"
        })
      }), /*#__PURE__*/(0,jsx_runtime.jsxs)(ScrollView/* default */.A, {
        style: AnomalyRulesScreen_styles.scrollView,
        contentContainerStyle: AnomalyRulesScreen_styles.scrollContent,
        showsVerticalScrollIndicator: false,
        children: [rules.length === 0 ? /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: AnomalyRulesScreen_styles.emptyContainer,
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: AnomalyRulesScreen_styles.emptyIcon,
            children: "\uD83D\uDCCB"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: AnomalyRulesScreen_styles.emptyText,
            children: "\u5C1A\u672A\u8A2D\u5B9A\u4EFB\u4F55\u898F\u5247"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: AnomalyRulesScreen_styles.emptyHint,
            children: "\u9EDE\u64CA\u53F3\u4E0A\u89D2 \uFF0B \u6DFB\u52A0\u60A8\u7684\u7B2C\u4E00\u500B\u7570\u5E38\u898F\u5247"
          })]
        }) : rules.map(renderRuleCard), rules.length > 0 && /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: AnomalyRulesScreen_styles.tipContainer,
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: AnomalyRulesScreen_styles.tipTitle,
            children: "\uD83D\uDCA1 \u5C0F\u63D0\u793A"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: AnomalyRulesScreen_styles.tipText,
            children: "\u5EFA\u8B70\u8A2D\u5B9A\u591A\u500B\u4E0D\u540C\u5929\u6578\u7684\u898F\u5247\uFF0C\u4F8B\u5982\uFF1A2\u5929\u6642\u767C\u9001\u63D0\u9192\uFF0C7\u5929\u6642\u767C\u9001\u7DCA\u6025\u8B66\u5831\u3002"
          })]
        })]
      }), /*#__PURE__*/(0,jsx_runtime.jsx)(Modal/* default */.A, {
        visible: isModalVisible,
        animationType: "slide",
        transparent: true,
        onRequestClose: closeModal,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
          style: AnomalyRulesScreen_styles.modalOverlay,
          children: /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: AnomalyRulesScreen_styles.modalContent,
            children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: AnomalyRulesScreen_styles.modalTitle,
              children: editingRule ? '編輯規則' : '新增規則'
            }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              style: AnomalyRulesScreen_styles.inputGroup,
              children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: AnomalyRulesScreen_styles.inputLabel,
                children: "\u898F\u5247\u540D\u7A31"
              }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
                style: AnomalyRulesScreen_styles.input,
                value: ruleName,
                onChangeText: setRuleName,
                placeholder: "\u4F8B\u5982\uFF1A\u9023\u7E8C\u672A\u7C3D\u5230 3 \u5929",
                placeholderTextColor: COLORS.textLight
              })]
            }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              style: AnomalyRulesScreen_styles.inputGroup,
              children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: AnomalyRulesScreen_styles.inputLabel,
                children: "\u672A\u7C3D\u5230\u5929\u6578"
              }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
                style: AnomalyRulesScreen_styles.daysInputContainer,
                children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
                  style: [AnomalyRulesScreen_styles.input, AnomalyRulesScreen_styles.daysInput],
                  value: ruleDays,
                  onChangeText: setRuleDays,
                  placeholder: "2",
                  placeholderTextColor: COLORS.textLight,
                  keyboardType: "numeric",
                  maxLength: 2
                }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: AnomalyRulesScreen_styles.daysUnit,
                  children: "\u5929"
                })]
              }), /*#__PURE__*/(0,jsx_runtime.jsxs)(Text/* default */.A, {
                style: AnomalyRulesScreen_styles.inputHint,
                children: ["\u7576\u9023\u7E8C ", ruleDays || '?', " \u5929\u672A\u7C3D\u5230\u6642\u89F8\u767C\u901A\u77E5"]
              })]
            }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              style: AnomalyRulesScreen_styles.modalButtons,
              children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
                style: AnomalyRulesScreen_styles.cancelButton,
                onPress: closeModal,
                children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: AnomalyRulesScreen_styles.cancelButtonText,
                  children: "\u53D6\u6D88"
                })
              }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
                style: AnomalyRulesScreen_styles.saveButton,
                onPress: handleSave,
                children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: AnomalyRulesScreen_styles.saveButtonText,
                  children: "\u5132\u5B58"
                })
              })]
            })]
          })
        })
      })]
    })
  });
};
const AnomalyRulesScreen_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md
  },
  backButton: {
    padding: SPACING.sm
  },
  backIcon: {
    fontSize: FONTS.size.xxl,
    color: COLORS.textPrimary
  },
  headerTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addIcon: {
    fontSize: FONTS.size.xl,
    color: COLORS.white,
    fontWeight: FONTS.bold
  },
  infoContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg
  },
  infoText: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    lineHeight: FONTS.size.sm * 1.5
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl
  },
  ruleCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm
  },
  ruleContent: {
    marginBottom: SPACING.md
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  ruleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md
  },
  ruleIconText: {
    fontSize: 20
  },
  ruleInfo: {
    flex: 1
  },
  ruleName: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs
  },
  ruleDesc: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    lineHeight: FONTS.size.sm * 1.4
  },
  ruleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200
  },
  deleteButton: {
    padding: SPACING.sm
  },
  deleteIcon: {
    fontSize: 18
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: SPACING.huge
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: SPACING.lg
  },
  emptyText: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm
  },
  emptyHint: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary,
    textAlign: 'center'
  },
  tipContainer: {
    backgroundColor: COLORS.info + '15',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg
  },
  tipTitle: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.semiBold,
    color: COLORS.info,
    marginBottom: SPACING.sm
  },
  tipText: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    lineHeight: FONTS.size.sm * 1.5
  },
  // Modal 樣式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%'
  },
  modalTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xl
  },
  inputGroup: {
    marginBottom: SPACING.lg
  },
  inputLabel: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary
  },
  daysInputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  daysInput: {
    flex: 1,
    textAlign: 'center'
  },
  daysUnit: {
    fontSize: FONTS.size.lg,
    color: COLORS.textSecondary,
    marginLeft: SPACING.md
  },
  inputHint: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    marginTop: SPACING.sm
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    gap: SPACING.md
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    alignItems: 'center'
  },
  cancelButtonText: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary
  },
  saveButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center'
  },
  saveButtonText: {
    fontSize: FONTS.size.md,
    color: COLORS.white,
    fontWeight: FONTS.semiBold
  }
});
/* harmony default export */ const screens_AnomalyRulesScreen = (AnomalyRulesScreen);
;// ./src/screens/ProfileScreen/index.tsx
/**
 * ProfileScreen - 個人中心頁面
 * 用戶資料管理與帳號設定
 */

















/**
 * 個人中心頁面
 */
const ProfileScreen = () => {
  const navigation = (0,native_lib_module.useNavigation)();
  const {
    user,
    logout,
    refreshUser
  } = useAuth();

  // 編輯模式狀態
  const [isEditModalVisible, setIsEditModalVisible] = (0,react.useState)(false);
  const [editName, setEditName] = (0,react.useState)('');
  const [editPhone, setEditPhone] = (0,react.useState)('');
  const [editLineId, setEditLineId] = (0,react.useState)('');
  const [isUpdating, setIsUpdating] = (0,react.useState)(false);

  // 初始化編輯資料
  const openEditModal = () => {
    setEditName(user?.name || '');
    setEditPhone(user?.phoneNumber || '');
    setEditLineId(user?.lineId || '');
    setIsEditModalVisible(true);
  };

  /**
   * 儲存個人資料
   */
  const handleSaveProfile = async () => {
    if (!editName) {
      Alert/* default */.A.alert('錯誤', '姓名不能為空');
      return;
    }
    setIsUpdating(true);
    try {
      const response = await authService.updateProfile({
        name: editName,
        phoneNumber: editPhone,
        lineId: editLineId
      });
      if (response.data) {
        // 重新獲取用戶資料以更新 Context
        await refreshUser();
        Alert/* default */.A.alert('成功', '個人資料已更新');
        setIsEditModalVisible(false);
      } else {
        Alert/* default */.A.alert('失敗', response.error?.message || '更新失敗');
      }
    } catch (error) {
      Alert/* default */.A.alert('錯誤', error.message || '更新發生錯誤');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * 處理登出
   */
  const handleLogout = () => {
    Alert/* default */.A.alert('確認登出', '確定要登出嗎？', [{
      text: '取消',
      style: 'cancel'
    }, {
      text: '登出',
      style: 'destructive',
      onPress: async () => {
        await logout();
        // 登出後會自動導航到登入頁面（由 AuthContext 處理）
      }
    }]);
  };

  /**
   * 功能選單項目
   */
  const menuItems = [
  // 帳號設定
  [{
    id: 'edit_profile',
    icon: '👤',
    title: '編輯個人資料',
    onPress: openEditModal,
    showArrow: true
  }, {
    id: 'change_password',
    icon: '🔐',
    title: '修改密碼',
    onPress: () => Alert/* default */.A.alert('提示', '前往修改密碼'),
    showArrow: true
  }],
  // ... (其他選單項目保持不變) ...
  // 通知設定
  [{
    id: 'notification',
    icon: '🔔',
    title: '通知設定',
    subtitle: '管理通知渠道',
    onPress: () => Alert/* default */.A.alert('提示', '前往通知設定'),
    showArrow: true
  }, {
    id: 'message_templates',
    icon: '💬',
    title: '訊息模板',
    subtitle: '自訂通知訊息',
    onPress: () => navigation.navigate('MessageTemplates'),
    showArrow: true
  }, {
    id: 'anomaly_rules',
    icon: '⚠️',
    title: '異常規則',
    subtitle: '設定觸發條件',
    onPress: () => Alert/* default */.A.alert('提示', '前往異常規則'),
    showArrow: true
  }],
  // 其他
  [{
    id: 'privacy',
    icon: '🔒',
    title: '隱私設定',
    onPress: () => Alert/* default */.A.alert('提示', '前往隱私設定'),
    showArrow: true
  }, {
    id: 'help',
    icon: '❓',
    title: '幫助中心',
    onPress: () => Alert/* default */.A.alert('提示', '前往幫助中心'),
    showArrow: true
  }, {
    id: 'about',
    icon: 'ℹ️',
    title: '關於我們',
    subtitle: `版本 ${APP_INFO.VERSION}`,
    onPress: () => Alert/* default */.A.alert('提示', '前往關於我們'),
    showArrow: true
  }],
  // 危險操作
  [{
    id: 'logout',
    icon: '🚪',
    title: '登出',
    onPress: handleLogout,
    danger: true
  }]];

  /**
   * 渲染選單項目
   */
  const renderMenuItem = item => /*#__PURE__*/(0,jsx_runtime.jsxs)(TouchableOpacity/* default */.A, {
    style: ProfileScreen_styles.menuItem,
    onPress: item.onPress,
    activeOpacity: 0.7,
    children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
      style: ProfileScreen_styles.menuIcon,
      children: item.icon
    }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
      style: ProfileScreen_styles.menuContent,
      children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
        style: [ProfileScreen_styles.menuTitle, item.danger && ProfileScreen_styles.menuTitleDanger],
        children: item.title
      }), item.subtitle && /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
        style: ProfileScreen_styles.menuSubtitle,
        children: item.subtitle
      })]
    }), item.showArrow && /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
      style: ProfileScreen_styles.menuArrow,
      children: "\u203A"
    })]
  }, item.id);

  /**
   * 渲染選單組
   */
  const renderMenuGroup = (items, index) => /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
    style: ProfileScreen_styles.menuGroup,
    children: items.map((item, itemIndex) => /*#__PURE__*/(0,jsx_runtime.jsxs)(react.Fragment, {
      children: [renderMenuItem(item), itemIndex < items.length - 1 && /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
        style: ProfileScreen_styles.menuDivider
      })]
    }, item.id))
  }, index);
  return /*#__PURE__*/(0,jsx_runtime.jsx)(components_GradientBackground, {
    variant: "light",
    children: /*#__PURE__*/(0,jsx_runtime.jsxs)(SafeAreaView/* default */.A, {
      style: ProfileScreen_styles.container,
      children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(ScrollView/* default */.A, {
        style: ProfileScreen_styles.scrollView,
        contentContainerStyle: ProfileScreen_styles.scrollContent,
        showsVerticalScrollIndicator: false,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
          style: ProfileScreen_styles.profileCard,
          children: user ? /*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
            children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              style: ProfileScreen_styles.avatarContainer,
              children: [/*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
                style: ProfileScreen_styles.avatar,
                children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: ProfileScreen_styles.avatarText,
                  children: user.name?.charAt(0) || '?'
                })
              }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
                style: ProfileScreen_styles.editAvatarButton,
                onPress: openEditModal,
                children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: ProfileScreen_styles.editAvatarIcon,
                  children: "\u270F\uFE0F"
                })
              })]
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: ProfileScreen_styles.userName,
              children: user.name
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: ProfileScreen_styles.userEmail,
              children: user.email
            }), user.phoneNumber && /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: ProfileScreen_styles.userPhone,
              children: user.phoneNumber
            }), user.lineId && /*#__PURE__*/(0,jsx_runtime.jsxs)(Text/* default */.A, {
              style: [ProfileScreen_styles.userPhone, {
                color: COLORS.success
              }],
              children: ["LINE: ", user.lineId]
            }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
              style: ProfileScreen_styles.statsContainer,
              children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
                style: ProfileScreen_styles.statItem,
                children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: ProfileScreen_styles.statValue,
                  children: "-"
                }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: ProfileScreen_styles.statLabel,
                  children: "\u9023\u7E8C\u7C3D\u5230"
                })]
              }), /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
                style: ProfileScreen_styles.statDivider
              }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
                style: ProfileScreen_styles.statItem,
                children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: ProfileScreen_styles.statValue,
                  children: "-"
                }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                  style: ProfileScreen_styles.statLabel,
                  children: "\u7E3D\u7C3D\u5230\u6578"
                })]
              })]
            })]
          }) : /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: ProfileScreen_styles.notLoginContainer,
            children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
              style: ProfileScreen_styles.notLoginText,
              children: "\u5C1A\u672A\u767B\u5165"
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
              style: ProfileScreen_styles.loginButton,
              onPress: () => {
                // 導航到登入頁，需透過 useNavigation
                const {
                  useNavigation
                } = __webpack_require__(7397);
                const navigation = useNavigation();
                navigation.navigate('Auth');
              },
              children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: ProfileScreen_styles.loginButtonText,
                children: "\u7ACB\u5373\u767B\u5165"
              })
            })]
          })
        }), user && menuItems.map((group, index) => renderMenuGroup(group, index)), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: ProfileScreen_styles.footer,
          children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(Text/* default */.A, {
            style: ProfileScreen_styles.footerText,
            children: [APP_INFO.NAME, " v", APP_INFO.VERSION]
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: ProfileScreen_styles.footerCopyright,
            children: "\xA9 2026 ALIVE. All rights reserved."
          })]
        })]
      }), isEditModalVisible && /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
        style: ProfileScreen_styles.modalOverlay,
        children: /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
          style: ProfileScreen_styles.modalContainer,
          children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: ProfileScreen_styles.modalTitle,
            children: "\u7DE8\u8F2F\u500B\u4EBA\u8CC7\u6599"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: ProfileScreen_styles.inputLabel,
            children: "\u59D3\u540D"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
            style: ProfileScreen_styles.input,
            value: editName,
            onChangeText: setEditName,
            placeholder: "\u8ACB\u8F38\u5165\u59D3\u540D"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
            style: ProfileScreen_styles.input,
            value: editPhone,
            onChangeText: setEditPhone,
            placeholder: "\u8ACB\u8F38\u5165\u96FB\u8A71\u865F\u78BC",
            keyboardType: "phone-pad"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
            style: ProfileScreen_styles.inputLabel,
            children: "LINE ID"
          }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
            style: ProfileScreen_styles.input,
            value: editLineId,
            onChangeText: setEditLineId,
            placeholder: "\u8ACB\u8F38\u5165 LINE ID (\u9078\u586B)",
            autoCapitalize: "none"
          }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
            style: ProfileScreen_styles.modalButtons,
            children: [/*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
              style: [ProfileScreen_styles.modalButton, ProfileScreen_styles.cancelButton],
              onPress: () => setIsEditModalVisible(false),
              children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: ProfileScreen_styles.cancelButtonText,
                children: "\u53D6\u6D88"
              })
            }), /*#__PURE__*/(0,jsx_runtime.jsx)(TouchableOpacity/* default */.A, {
              style: [ProfileScreen_styles.modalButton, ProfileScreen_styles.saveButton],
              onPress: handleSaveProfile,
              disabled: isUpdating,
              children: isUpdating ? /*#__PURE__*/(0,jsx_runtime.jsx)(ActivityIndicator/* default */.A, {
                color: COLORS.white
              }) : /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
                style: ProfileScreen_styles.saveButtonText,
                children: "\u5132\u5B58"
              })
            })]
          })]
        })
      })]
    })
  });
};
const ProfileScreen_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl
  },
  profileCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.md
  },
  notLoginContainer: {
    alignItems: 'center',
    padding: SPACING.lg
  },
  notLoginText: {
    fontSize: FONTS.size.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.semiBold
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontSize: 32,
    fontWeight: FONTS.bold,
    color: COLORS.white
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm
  },
  editAvatarIcon: {
    fontSize: 14
  },
  userName: {
    fontSize: FONTS.size.xxl,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs
  },
  userEmail: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs
  },
  userPhone: {
    fontSize: FONTS.size.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statValue: {
    fontSize: FONTS.size.title,
    fontWeight: FONTS.bold,
    color: COLORS.primary
  },
  statLabel: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray200
  },
  menuGroup: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.sm
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg
  },
  menuIcon: {
    fontSize: 22,
    marginRight: SPACING.md,
    width: 28,
    textAlign: 'center'
  },
  menuContent: {
    flex: 1
  },
  menuTitle: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.medium,
    color: COLORS.textPrimary
  },
  menuTitleDanger: {
    color: COLORS.danger
  },
  menuSubtitle: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  menuArrow: {
    fontSize: FONTS.size.xxl,
    color: COLORS.textLight
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.gray100,
    marginLeft: SPACING.lg + 28 + SPACING.md
  },
  footer: {
    alignItems: 'center',
    paddingTop: SPACING.xl
  },
  footerText: {
    fontSize: FONTS.size.sm,
    color: COLORS.textLight
  },
  footerCopyright: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    zIndex: 1000
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.lg
  },
  modalTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center'
  },
  inputLabel: {
    fontSize: FONTS.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    fontSize: FONTS.size.md
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    gap: SPACING.md
  },
  modalButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: COLORS.gray100
  },
  saveButton: {
    backgroundColor: COLORS.primary
  },
  cancelButtonText: {
    color: COLORS.textPrimary,
    fontWeight: FONTS.medium
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.bold
  }
});
/* harmony default export */ const screens_ProfileScreen = (ProfileScreen);
;// ./src/screens/index.ts
/**
 * 頁面統一匯出
 */








;// ./src/navigation/AppNavigator.web.tsx









// 導入頁面




const Stack = (0,createStackNavigator/* createStackNavigator */.M)();
const Tab = (0,bottom_tabs_lib_module/* createBottomTabNavigator */.W9)();

/**
 * 底部導航欄
 */
function MainTabNavigator() {
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(Tab.Navigator, {
    screenOptions: ({
      route
    }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: {
        backgroundColor: COLORS.cardBackground,
        borderTopColor: COLORS.gray300,
        paddingBottom: SPACING.xs,
        height: 60
      },
      tabBarLabelStyle: {
        fontSize: FONTS.size.xs,
        marginBottom: SPACING.xs
      },
      tabBarIcon: ({
        focused,
        color,
        size
      }) => {
        let iconName = '';
        if (route.name === ROUTES.HOME) iconName = '🏠';
        if (route.name === ROUTES.SETTINGS) iconName = '⚙️';
        if (route.name === ROUTES.EMERGENCY_CONTACTS) iconName = '👥';
        if (route.name === ROUTES.PROFILE) iconName = '👤';
        return /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: {
            fontSize: size
          },
          children: iconName
        });
      }
    }),
    children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Tab.Screen, {
      name: ROUTES.HOME,
      component: screens_HomeScreen,
      options: {
        title: '首頁'
      }
    }), /*#__PURE__*/(0,jsx_runtime.jsx)(Tab.Screen, {
      name: ROUTES.EMERGENCY_CONTACTS,
      component: screens_EmergencyContactsScreen,
      options: {
        title: '聯絡人'
      }
    }), /*#__PURE__*/(0,jsx_runtime.jsx)(Tab.Screen, {
      name: ROUTES.PROFILE,
      component: screens_ProfileScreen,
      options: {
        title: '我的'
      }
    }), /*#__PURE__*/(0,jsx_runtime.jsx)(Tab.Screen, {
      name: ROUTES.SETTINGS,
      component: screens_SettingsScreen,
      options: {
        title: '設定'
      }
    })]
  });
}

/**
 * 主導航器
 */
function AppNavigator() {
  const {
    isAuthenticated,
    isLoading
  } = useAuth();
  if (isLoading) {
    return /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
      style: AppNavigator_web_styles.loadingContainer,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
        style: AppNavigator_web_styles.loadingText,
        children: "Loading..."
      })
    });
  }
  return /*#__PURE__*/(0,jsx_runtime.jsx)(native_lib_module.NavigationContainer, {
    children: /*#__PURE__*/(0,jsx_runtime.jsx)(Stack.Navigator, {
      screenOptions: {
        headerShown: false
      },
      children: !isAuthenticated ? /*#__PURE__*/(0,jsx_runtime.jsx)(Stack.Screen, {
        name: ROUTES.AUTH,
        component: AuthScreen
      }) : /*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Stack.Screen, {
          name: "MainTabs",
          component: MainTabNavigator
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Stack.Screen, {
          name: ROUTES.MESSAGE_TEMPLATES,
          component: screens_MessageTemplatesScreen,
          options: {
            headerShown: true,
            title: '訊息範本'
          }
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Stack.Screen, {
          name: ROUTES.NOTIFICATION_SETTINGS,
          component: screens_NotificationSettingsScreen,
          options: {
            headerShown: true,
            title: '通知設定'
          }
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Stack.Screen, {
          name: ROUTES.ANOMALY_RULES,
          component: screens_AnomalyRulesScreen,
          options: {
            headerShown: true,
            title: '異常規則'
          }
        })]
      })
    })
  });
}
const AppNavigator_web_styles = StyleSheet/* default */.A.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  loadingText: {
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary
  }
});
;// ./src/navigation/index.ts
/**
 * 導航統一匯出
 */

;// ./App.tsx
/**
 * ALIVE愛來 APP - 主應用入口
 * 安全簽到應用程式的根元件
 */












/**
 * 應用程式根元件
 */

const App = () => {
  const [isInitialized, setIsInitialized] = (0,react.useState)(false);
  const [initError, setInitError] = (0,react.useState)(null);

  /**
   * 初始化應用程式
   */
  (0,react.useEffect)(() => {
    const initialize = async () => {
      try {
        // 初始化 Firebase
        // NOTE: 暫時註解，等配置好 Firebase 後再啟用
        // await initializeFirebase();

        // 模擬初始化延遲
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsInitialized(true);
      } catch (error) {
        console.error('初始化失敗:', error);
        setInitError(error.message || '應用程式初始化失敗');
      }
    };
    initialize();
  }, []);

  // 顯示載入畫面
  if (!isInitialized) {
    return /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
      style: App_styles.splashContainer,
      children: [/*#__PURE__*/(0,jsx_runtime.jsx)(StatusBar/* default */.A, {
        barStyle: "light-content",
        backgroundColor: COLORS.primary
      }), /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
        style: App_styles.logoContainer,
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: App_styles.logoEmoji,
          children: "\uD83D\uDE0A"
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: App_styles.appName,
          children: APP_INFO.NAME
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
          style: App_styles.slogan,
          children: APP_INFO.SLOGAN
        })]
      }), initError ? /*#__PURE__*/(0,jsx_runtime.jsx)(Text/* default */.A, {
        style: App_styles.errorText,
        children: initError
      }) : /*#__PURE__*/(0,jsx_runtime.jsx)(ActivityIndicator/* default */.A, {
        size: "large",
        color: COLORS.white,
        style: App_styles.loader
      })]
    });
  }
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(AuthProvider, {
    children: [/*#__PURE__*/(0,jsx_runtime.jsx)(StatusBar/* default */.A, {
      barStyle: "dark-content",
      backgroundColor: "transparent",
      translucent: true
    }), /*#__PURE__*/(0,jsx_runtime.jsx)(AppNavigator, {})]
  });
};
const App_styles = StyleSheet/* default */.A.create({
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 20
  },
  appName: {
    fontSize: FONTS.size.display,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginBottom: 8
  },
  slogan: {
    fontSize: FONTS.size.lg,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 8
  },
  loader: {
    marginTop: 20
  },
  errorText: {
    fontSize: FONTS.size.md,
    color: COLORS.danger,
    textAlign: 'center',
    paddingHorizontal: 40
  }
});
/* harmony default export */ const App_0 = (App);

/***/ }

}]);
//# sourceMappingURL=bundle.web.0699082dcbaded26804c.js.map
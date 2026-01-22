/**
 * ALIVE愛來 APP - 主應用入口
 * 安全簽到應用程式的根元件
 */
import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AppNavigator } from './src/navigation';
import { initializeFirebase } from './src/services/firebase';
import { COLORS, FONTS } from './src/theme';
import { APP_INFO } from './src/constants';
import { AuthProvider } from './src/contexts/AuthContext';

/**
 * 應用程式根元件
 */
const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  /**
   * 初始化應用程式
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // 初始化 Firebase
        // NOTE: 暫時註解，等配置好 Firebase 後再啟用
        // await initializeFirebase();

        // 模擬初始化延遲
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsInitialized(true);
      } catch (error: any) {
        console.error('初始化失敗:', error);
        setInitError(error.message || '應用程式初始化失敗');
      }
    };

    initialize();
  }, []);

  // 顯示載入畫面
  if (!isInitialized) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>😊</Text>
          <Text style={styles.appName}>{APP_INFO.NAME}</Text>
          <Text style={styles.slogan}>{APP_INFO.SLOGAN}</Text>
        </View>
        {initError ? (
          <Text style={styles.errorText}>{initError}</Text>
        ) : (
          <ActivityIndicator size="large" color={COLORS.white} style={styles.loader} />
        )}
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <AppNavigator />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: FONTS.size.display,
    fontWeight: FONTS.bold as any,
    color: COLORS.white,
    marginBottom: 8,
  },
  slogan: {
    fontSize: FONTS.size.lg,
    color: COLORS.white,
    opacity: 0.8,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    fontSize: FONTS.size.md,
    color: COLORS.danger,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default App;

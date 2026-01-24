/**
 * ALIVE愛來 APP - Expo 版完整整合 (v1.1)
 * 更新內容：
 * 1. 修復 SafeAreaView 警告 (改用 react-native-safe-area-context)
 * 2. 新增 AsyncStorage 資料持久化 (重啟 APP 資料不流失)
 * 3. 優化 LINE 綁定模擬流程
 */
import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  TextInput,
  Switch,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import checkinService from './src/services/api/checkinService';
import contactsService from './src/services/api/contactsService';
import { useAuthContext } from './src/contexts/AuthContext';
import { EmergencyContact } from './src/types';
import { AuthProvider } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import 'react-native-gesture-handler';

// ============ 設計系統 ============
const COLORS = {
  primary: '#00B894',
  primaryLight: '#55EFC4',
  white: '#FFFFFF',
  black: '#2D3436',
  gray100: '#F8F9FA',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  textLight: '#B2BEC3',
  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#E17055',
  info: '#74B9FF',
  background: '#F0FFF4',
  cardBackground: '#FFFFFF',
};

const Tab = createBottomTabNavigator();
const STORAGE_KEYS = {
  CHECK_IN: '@alive_check_in',
  SETTINGS: '@alive_settings',
  CONTACTS: '@alive_contacts',
};

// ============ 共用容器 (處理 Safe Area) ============
const ScreenContainer: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }, style]}>
      {children}
    </View>
  );
};

// ============ 首頁 ============
const HomeScreen: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [lastCheckInTime, setLastCheckInTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 載入簽到狀態
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await checkinService.getHistory(1);
        if (response.data && response.data.history.length > 0) {
          const latest = response.data.history[0];
          const date = new Date(latest.checkedAt);
          setLastCheckInTime(date);

          // 檢查是否為今日
          const today = new Date();
          const isToday = date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
          setIsCheckedIn(isToday);
        }
      } catch (e) {
        console.error('Failed to load check-in status');
      } finally {
        setIsLoading(false);
      }
    };
    loadStatus();
  }, [isCheckedIn]); // Add isCheckedIn to dependency to auto-refresh on change

  const handleCheckIn = useCallback(async () => {
    if (isCheckedIn) {
      Alert.alert('已簽到', '您今天已經完成簽到了！');
      return;
    }

    try {
      const response = await checkinService.createCheckIn({
        location: { latitude: 0, longitude: 0 }, // TODO: Get real location
        note: 'App Check-in'
      });

      if (response.data) {
        const now = new Date();
        setIsCheckedIn(true);
        setLastCheckInTime(now);
        Alert.alert('簽到成功！✨', '您的平安已記錄，願您今天一切順利！');
      } else {
        Alert.alert('簽到失敗', response.error?.message || '未知錯誤');
      }
    } catch (e) {
      console.error('Failed to check in', e);
      Alert.alert('簽到失敗', '網路連線異常');
    }
  }, [isCheckedIn]);

  const getDateString = (): string => {
    const now = new Date();
    return now.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>今日狀態</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.dateText}>{getDateString()}</Text>
        <Text style={styles.statusHint}>
          {isCheckedIn ? '今日已簽到，願您平安順心 ✨' : '點擊下方按鈕完成今日簽到'}
        </Text>

        {/* 簽到按鈕 */}
        <TouchableOpacity
          onPress={handleCheckIn}
          activeOpacity={0.8}
          style={[styles.checkInButton, isCheckedIn && styles.checkInButtonChecked]}
        >
          <View style={[styles.checkInInner, isCheckedIn && styles.checkInInnerChecked]}>
            <Text style={styles.faceIcon}>{isCheckedIn ? '✓' : '😊'}</Text>
          </View>
          <Text style={[styles.checkInText, isCheckedIn && styles.checkInTextChecked]}>
            {isCheckedIn ? '已簽到' : '今日簽到'}
          </Text>
        </TouchableOpacity>

        {lastCheckInTime && (
          <Text style={styles.lastCheckInText}>
            最後簽到：{new Date(lastCheckInTime).toLocaleTimeString('zh-TW')}
          </Text>
        )}

        <View style={styles.sloganContainer}>
          <Text style={styles.slogan}>每日一開，平安已達</Text>
        </View>

        {/* 狀態卡片 */}
        <View style={[styles.card, { backgroundColor: isCheckedIn ? '#E8F5E9' : '#FFF8E1' }]}>
          <Text style={styles.cardTitle}>安全狀態</Text>
          <Text style={styles.cardSubtitle}>{isCheckedIn ? '✓ 狀態安全' : '⚠ 待簽到'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>緊急聯絡人</Text>
          <Text style={styles.cardSubtitle}>前往「聯絡人」頁面設置</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

// ============ 設定頁面 ============
const SettingsScreen: React.FC = () => {
  const [notifyDays, setNotifyDays] = useState('2');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [lineConnected, setLineConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // 載入設定
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (stored) {
          const settings = JSON.parse(stored);
          setNotifyDays(String(settings.notifyDays || '2'));
          // 強制轉換為 boolean，防止字串 "true"/"false" 導致 Crash
          setReminderEnabled(settings.reminderEnabled === true || settings.reminderEnabled === 'true');
          setLineConnected(settings.lineConnected === true || settings.lineConnected === 'true');
        }
      } catch (e) {
        console.error('Failed to load settings');
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async (newSettings: any) => {
    try {
      const currentStored = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      const current = currentStored ? JSON.parse(currentStored) : {};
      const updated = { ...current, ...newSettings };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save settings');
    }
  };

  const handleConnectLine = () => {
    if (lineConnected) {
      Alert.alert('解除綁定', '確定要解除 LINE Notify 綁定嗎？', [
        { text: '取消' },
        {
          text: '解除',
          style: 'destructive',
          onPress: () => {
            setLineConnected(false);
            saveSettings({ lineConnected: false });
          }
        }
      ]);
      return;
    }

    Alert.alert(
      '連接 LINE Notify',
      '將開啟 LINE 授權頁面進行綁定',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '立即綁定',
          onPress: () => {
            setIsConnecting(true);
            // 模擬連接過程
            setTimeout(() => {
              setIsConnecting(false);
              setLineConnected(true);
              saveSettings({ lineConnected: true });
              Alert.alert('綁定成功', 'LINE Notify 已成功綁定！');
            }, 1500);
          },
        },
      ]
    );
  };

  const handleNotifyDaysChange = (text: string) => {
    setNotifyDays(text);
    saveSettings({ notifyDays: text });
  };

  const handleReminderChange = (val: boolean) => {
    setReminderEnabled(val);
    saveSettings({ reminderEnabled: val });
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>設定中心</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 簽到機制設定 */}
        <Text style={styles.sectionTitle}>📅 簽到機制</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>未簽到通知天數</Text>
            <View style={styles.inputRow}>
              {[1, 2, 3].map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayOption,
                    notifyDays === String(day) && styles.dayOptionSelected
                  ]}
                  onPress={() => handleNotifyDaysChange(String(day))}
                >
                  <Text
                    style={[
                      styles.dayOptionText,
                      notifyDays === String(day) && styles.dayOptionTextSelected
                    ]}
                  >
                    {day} 天
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={styles.settingHint}>
            連續未簽到達此天數時，系統會通知緊急聯絡人
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>每日簽到提醒</Text>
            <Switch
              value={!!reminderEnabled}
              onValueChange={handleReminderChange}
            />
          </View>
        </View>

        {/* 通知渠道 */}
        <Text style={styles.sectionTitle}>🔔 通知渠道</Text>

        <TouchableOpacity style={styles.card} onPress={handleConnectLine} disabled={isConnecting}>
          <View style={styles.settingRow}>
            <View style={styles.channelInfo}>
              <Text style={styles.channelIcon}>💚</Text>
              <View>
                <Text style={styles.settingLabel}>LINE Notify</Text>
                <Text style={styles.settingHint}>
                  {isConnecting ? '正在連接...' : (lineConnected ? '已綁定' : '點擊綁定 LINE 帳號')}
                </Text>
              </View>
            </View>
            {isConnecting ? (
              <ActivityIndicator color={COLORS.primary} size="small" />
            ) : (
              <View style={[styles.statusBadge, { backgroundColor: lineConnected ? COLORS.success : COLORS.gray300 }]}>
                <Text style={styles.statusBadgeText}>{lineConnected ? '✓' : '→'}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.channelInfo}>
              <Text style={styles.channelIcon}>📧</Text>
              <View>
                <Text style={styles.settingLabel}>Email 通知</Text>
                <Text style={styles.settingHint}>設定接收通知的郵箱</Text>
              </View>
            </View>
            <Text style={styles.linkText}>設定 →</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.channelInfo}>
              <Text style={styles.channelIcon}>🔔</Text>
              <View>
                <Text style={styles.settingLabel}>推播通知</Text>
                <Text style={styles.settingHint}>已啟用</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: COLORS.success }]}>
              <Text style={styles.statusBadgeText}>✓</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

// ============ 聯絡人頁面 ============
const ContactsScreen: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // 載入聯絡人
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await contactsService.getContacts();
        if (response.data) {
          // Add enabled flag locally if API doesn't have it, or assume all API contacts are enabled
          // API EmergencyContact doesn't have 'enabled' field usually, assume active.
          // Adjust logic to match API type
          setContacts(response.data.contacts);
        }
      } catch (e) {
        console.error('Failed to load contacts');
      }
    };
    loadContacts();
  }, []);

  // Removed saveContacts as sync is handling by individual Add/Delete calls

  const toggleContact = (id: string) => {
    // API doesn't support toggle enable currently
    Alert.alert('提示', '暫不支援停用聯絡人');
  };

  const handleAddContact = async () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert('錯誤', '請填寫姓名和電話');
      return;
    }

    try {
      const response = await contactsService.addContact(newName, newPhone);
      if (response.data) {
        setContacts([...contacts, response.data.contact]);
        setNewName('');
        setNewPhone('');
        setShowAddModal(false);
        Alert.alert('成功', '聯絡人已新增');
      } else {
        Alert.alert('失敗', response.error?.message || '新增失敗');
      }
    } catch (e) {
      Alert.alert('錯誤', '網路連線異常');
    }
  };

  const handleDeleteContact = (id: string, name: string) => {
    Alert.alert('確認刪除', `確定要刪除 ${name} 嗎？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        style: 'destructive',
        onPress: async () => {
          try {
            // id string vs number mismatch? The API uses integer ID.
            const numId = parseInt(id);
            if (!isNaN(numId)) {
              await contactsService.deleteContact(numId);
              const updated = contacts.filter(c => c.id !== id && c.id !== numId); // Handle both types just in case
              setContacts(updated);
            } else {
              // Fallback for local mock data if any
              const updated = contacts.filter(c => c.id !== id);
              setContacts(updated);
            }
          } catch (e) {
            Alert.alert('錯誤', '刪除失敗');
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>緊急聯絡人</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>＋ 新增</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.importButton} onPress={() => Alert.alert('提示', '通訊錄匯入功能需申請權限，暫未開放')}>
          <Text style={styles.importButtonText}>📥 從通訊錄匯入</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>已設置的聯絡人 ({contacts.length}/5)</Text>

        {contacts.map(contact => (
          <View key={contact.id} style={styles.contactCard}>
            <TouchableOpacity
              style={styles.contactInfo}
              onLongPress={() => handleDeleteContact(contact.id, contact.name)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{contact.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
            </TouchableOpacity>
            <Switch
              value={!!contact.enabled}
              onValueChange={() => toggleContact(contact.id)}
            />
          </View>
        ))}

        <Text style={styles.tipText}>💡 長按聯絡人卡片可刪除</Text>
      </ScrollView>

      {/* 新增聯絡人 Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新增緊急聯絡人</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>姓名</Text>
              <TextInput
                style={styles.textInput}
                value={newName}
                onChangeText={setNewName}
                placeholder="輸入聯絡人姓名"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>電話</Text>
              <TextInput
                style={styles.textInput}
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder="輸入電話號碼"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleAddContact}>
                <Text style={styles.confirmButtonText}>新增</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

// ============ 個人中心頁面 ============
const ProfileScreen: React.FC = () => {
  const user = { name: '使用者', email: 'user@example.com', checkInStreak: 15, totalCheckIns: 45 };

  return (
    <ScreenContainer>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 用戶資料卡片 */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.checkInStreak}</Text>
              <Text style={styles.statLabel}>連續簽到</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.totalCheckIns}</Text>
              <Text style={styles.statLabel}>總簽到數</Text>
            </View>
          </View>
        </View>

        {/* 選單 - 這裡點擊後僅提示，未來可導向詳細頁面 */}
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('提示', '編輯功能開發中')}>
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={styles.menuLabel}>編輯個人資料</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('提示', '修改密碼功能開發中')}>
            <Text style={styles.menuIcon}>🔐</Text>
            <Text style={styles.menuLabel}>修改密碼</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => Alert.alert('登出', '您已安全登出')}>
          <Text style={styles.logoutButtonText}>登出</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
};

// ============ 主應用 ============
// Web (JS-based) vs. Native (Native-based) Navigator

// Web (JS-based) vs. Native (Native-based) Navigator
const Stack = Platform.OS === 'web' ? createStackNavigator() : createNativeStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '首頁',
          tabBarIcon: ({ focused }) => <Text style={{ fontSize: 24 }}>{focused ? '🏠' : '🏠'}</Text>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: '設定',
          tabBarIcon: ({ focused }) => <Text style={{ fontSize: 24 }}>⚙️</Text>,
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarLabel: '聯絡人',
          tabBarIcon: ({ focused }) => <Text style={{ fontSize: 24 }}>👥</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ focused }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

// ============ 樣式 ============
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.textPrimary },
  addButtonText: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32 },
  dateText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 8 },
  statusHint: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24 },

  // 簽到按鈕
  checkInButton: {
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginVertical: 16,
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 8,
  },
  checkInButtonChecked: { backgroundColor: COLORS.gray300 },
  checkInInner: {
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  checkInInnerChecked: { backgroundColor: COLORS.gray200 },
  faceIcon: { fontSize: 50 },
  checkInText: { position: 'absolute', bottom: 20, color: COLORS.white, fontSize: 16, fontWeight: '600' },
  checkInTextChecked: { color: COLORS.textSecondary },
  lastCheckInText: { textAlign: 'center', fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },

  sloganContainer: { alignItems: 'center', marginVertical: 24 },
  slogan: { fontSize: 18, fontWeight: '500', color: COLORS.primary },

  // 卡片
  card: {
    backgroundColor: COLORS.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  cardSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },

  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginTop: 16, marginBottom: 12 },

  // 設定
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: { fontSize: 16, color: COLORS.textPrimary },
  settingHint: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dayOption: {
    width: 48,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  dayOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  dayOptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  dayOptionTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  channelInfo: { flexDirection: 'row', alignItems: 'center' },
  channelIcon: { fontSize: 24, marginRight: 12 },
  statusBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statusBadgeText: { color: COLORS.white, fontSize: 14, fontWeight: 'bold' },
  linkText: { fontSize: 14, color: COLORS.primary },

  // 聯絡人
  importButton: {
    backgroundColor: COLORS.primaryLight, paddingVertical: 12, borderRadius: 12,
    alignItems: 'center', marginBottom: 16,
  },
  importButtonText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  contactCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12,
  },
  contactInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  contactName: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  contactPhone: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  tipText: { fontSize: 12, color: COLORS.textLight, textAlign: 'center', marginTop: 16 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  textInput: {
    borderWidth: 1, borderColor: COLORS.gray300, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 12, fontSize: 16,
  },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: COLORS.gray300, alignItems: 'center' },
  cancelButtonText: { color: COLORS.textSecondary, fontSize: 16 },
  confirmButton: { flex: 1, paddingVertical: 14, borderRadius: 8, backgroundColor: COLORS.primary, alignItems: 'center' },
  confirmButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },

  // 個人中心
  profileCard: {
    backgroundColor: COLORS.cardBackground, borderRadius: 16, padding: 24,
    alignItems: 'center', marginBottom: 16, marginTop: 16,
  },
  profileAvatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  profileAvatarText: { color: COLORS.white, fontSize: 32, fontWeight: 'bold' },
  profileName: { fontSize: 22, fontWeight: 'bold', color: COLORS.textPrimary },
  profileEmail: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  statsContainer: { flexDirection: 'row', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: COLORS.gray200 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.gray200 },

  menuGroup: { backgroundColor: COLORS.cardBackground, borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 16, color: COLORS.textPrimary },
  menuArrow: { fontSize: 20, color: COLORS.textLight },

  logoutButton: { paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  logoutButtonText: { color: COLORS.danger, fontSize: 16 },

  tabBar: {
    backgroundColor: COLORS.white, borderTopWidth: 0,
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 10,
    height: 80, paddingTop: 8, paddingBottom: 24,
  },
});

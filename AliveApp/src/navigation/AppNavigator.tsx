/**
 * AppNavigator - 應用程式導航配置
 * 定義整個 APP 的導航結構
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme';
import { ROUTES } from '../constants';
import { RootStackParamList } from '../types';

// 導入頁面
import {
    HomeScreen,
    SettingsScreen,
    EmergencyContactsScreen,
    MessageTemplatesScreen,
    NotificationSettingsScreen,
    AnomalyRulesScreen,
    ProfileScreen,
} from '../screens';
import { AuthScreen } from '../screens/AuthScreen';
import { useAuth } from '../contexts/AuthContext';

// 創建導航器
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

/**
 * 底部標籤圖標元件
 */
interface TabIconProps {
    focused: boolean;
    icon: string;
    label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, icon, label }) => (
    <View style={styles.tabIconContainer}>
        <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
            {icon}
        </Text>
        <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
            {label}
        </Text>
    </View>
);

/**
 * 主要底部導航（登入後顯示）
 */
const MainTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name={ROUTES.HOME}
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="🏠" label="首頁" />
                    ),
                }}
            />
            <Tab.Screen
                name={ROUTES.SETTINGS}
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="⚙️" label="設置" />
                    ),
                }}
            />
            <Tab.Screen
                name={ROUTES.EMERGENCY_CONTACTS}
                component={EmergencyContactsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="👥" label="聯絡人" />
                    ),
                }}
            />
            <Tab.Screen
                name={ROUTES.PROFILE}
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon="👤" label="我的" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

/**
 * 根導航器
 */
const AppNavigator: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    //  載入中顯示空白畫面
    if (isLoading) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName={ROUTES.MAIN}
            >
                {/* 主要應用界面（預設進入） */}
                <Stack.Screen name={ROUTES.MAIN} component={MainTabNavigator} />

                {/* 認證與綁定頁面 */}
                <Stack.Screen
                    name={ROUTES.AUTH}
                    component={AuthScreen}
                    options={{
                        presentation: 'modal',
                        animation: 'slide_from_bottom',
                    }}
                />

                {/* 設定相關頁面 */}
                <Stack.Screen
                    name={ROUTES.ADD_EMERGENCY_CONTACT}
                    component={EmergencyContactsScreen}
                    options={{
                        presentation: 'modal',
                        animation: 'slide_from_bottom',
                    }}
                />
                <Stack.Screen
                    name={ROUTES.NOTIFICATION_SETTINGS}
                    component={NotificationSettingsScreen}
                    options={{
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name={ROUTES.MESSAGE_TEMPLATES}
                    component={MessageTemplatesScreen}
                    options={{
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name={ROUTES.ANOMALY_RULES}
                    component={AnomalyRulesScreen}
                    options={{
                        animation: 'slide_from_right',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: COLORS.white,
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        height: 80,
        paddingTop: SPACING.sm,
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        fontSize: 24,
        marginBottom: SPACING.xs,
    },
    tabIconFocused: {
        transform: [{ scale: 1.1 }],
    },
    tabLabel: {
        fontSize: FONTS.size.xs,
        color: COLORS.textLight,
    },
    tabLabelFocused: {
        color: COLORS.primary,
        fontWeight: FONTS.semiBold as any,
    },
});

export default AppNavigator;

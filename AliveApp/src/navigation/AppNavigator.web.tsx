import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, Platform } from 'react-native';
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

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

/**
 * 底部導航欄
 */
function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: {
                    backgroundColor: COLORS.cardBackground,
                    borderTopColor: COLORS.gray300,
                    paddingBottom: SPACING.xs,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: FONTS.size.xs,
                    marginBottom: SPACING.xs,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = '';
                    if (route.name === ROUTES.HOME) iconName = '🏠';
                    if (route.name === ROUTES.SETTINGS) iconName = '⚙️';
                    if (route.name === ROUTES.EMERGENCY_CONTACTS) iconName = '👥';
                    if (route.name === ROUTES.PROFILE) iconName = '👤';

                    return <Text style={{ fontSize: size }}>{iconName}</Text>;
                },
            })}
        >
            <Tab.Screen name={ROUTES.HOME} component={HomeScreen} options={{ title: '首頁' }} />
            <Tab.Screen name={ROUTES.EMERGENCY_CONTACTS} component={EmergencyContactsScreen} options={{ title: '聯絡人' }} />
            <Tab.Screen name={ROUTES.PROFILE} component={ProfileScreen} options={{ title: '我的' }} />
            <Tab.Screen name={ROUTES.SETTINGS} component={SettingsScreen} options={{ title: '設定' }} />
        </Tab.Navigator>
    );
}

/**
 * 主導航器
 */
export function AppNavigator() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <Stack.Screen name={ROUTES.AUTH} component={AuthScreen} />
                ) : (
                    <>
                        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                        <Stack.Screen
                            name={ROUTES.MESSAGE_TEMPLATES}
                            component={MessageTemplatesScreen}
                            options={{ headerShown: true, title: '訊息範本' }}
                        />
                        <Stack.Screen
                            name={ROUTES.NOTIFICATION_SETTINGS}
                            component={NotificationSettingsScreen}
                            options={{ headerShown: true, title: '通知設定' }}
                        />
                        <Stack.Screen
                            name={ROUTES.ANOMALY_RULES}
                            component={AnomalyRulesScreen}
                            options={{ headerShown: true, title: '異常規則' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        fontSize: FONTS.size.md,
        color: COLORS.textPrimary,
    },
});

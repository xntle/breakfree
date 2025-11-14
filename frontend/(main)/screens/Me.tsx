import * as React from 'react';
import { View, Text, ScrollView, Pressable, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useOnboard } from '(onboard)/OnboardingContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Me() {
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const { mode, blockedApps, allowedMessaging, setMode } = useOnboard();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  // Generate dynamic styles based on theme
  const dynamicStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        headerContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 12,
        },
        backButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
        },
        scrollContent: {
          padding: 20,
          paddingBottom: 100,
          maxWidth: 448,
          alignSelf: 'center',
          width: '100%',
        },
        header: {
          marginBottom: 24,
        },
        title: {
          fontSize: 32,
          fontWeight: '800',
          fontFamily: 'OpenSans-ExtraBold',
          color: theme.colors.text,
          marginBottom: 4,
        },
        subtitle: {
          fontSize: 16,
          color: theme.colors.textSecondary,
          fontWeight: '400',
          fontFamily: 'OpenSans-Regular',
        },
        card: {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
        },
        cardTitle: {
          fontSize: 18,
          fontWeight: '700',
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
          marginBottom: 12,
        },
        profileItem: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        profileLabel: {
          fontSize: 14,
          color: theme.colors.textSecondary,
        },
        profileValue: {
          fontSize: 14,
          fontWeight: '700',
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
        },
        settingItem: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        settingLabel: {
          fontSize: 14,
          color: theme.colors.text,
          fontWeight: '500',
          fontFamily: 'OpenSans-Medium',
        },
        settingValue: {
          fontSize: 14,
          color: theme.colors.textSecondary,
        },
        dangerText: {
          color: theme.colors.text,
          fontWeight: '600',
          fontFamily: 'OpenSans-SemiBold',
        },
        appVersion: {
          fontSize: 14,
          color: theme.colors.textSecondary,
          marginBottom: 8,
        },
        appDescription: {
          fontSize: 14,
          color: theme.colors.textSecondary,
          lineHeight: 20,
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      {/* Header with Back Button */}
      <View style={dynamicStyles.headerContainer}>
        <Pressable onPress={() => navigation.goBack()} style={dynamicStyles.backButton}>
          <ArrowLeft size={20} color={theme.colors.text} strokeWidth={2.5} />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={dynamicStyles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.title}>Me</Text>
          <Text style={dynamicStyles.subtitle}>Settings & preferences</Text>
        </View>

        {/* Profile Overview */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>Profile</Text>
          <View style={dynamicStyles.profileItem}>
            <Text style={dynamicStyles.profileLabel}>Current Mode</Text>
            <Text style={dynamicStyles.profileValue}>{mode} Mode</Text>
          </View>
          <View style={dynamicStyles.profileItem}>
            <Text style={dynamicStyles.profileLabel}>Blocked Apps</Text>
            <Text style={dynamicStyles.profileValue}>{blockedApps.length} apps</Text>
          </View>
          <View style={dynamicStyles.profileItem}>
            <Text style={dynamicStyles.profileLabel}>Messaging Apps</Text>
            <Text style={dynamicStyles.profileValue}>{allowedMessaging.length} apps</Text>
          </View>
        </View>

        {/* Device Management */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>Device Management</Text>
          <Pressable style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>Connected Devices</Text>
            <Text style={dynamicStyles.settingValue}>1 device</Text>
          </Pressable>
          <Pressable style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>Screen Time Access</Text>
            <Text style={dynamicStyles.settingValue}>Enabled</Text>
          </Pressable>
          <Pressable style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>App Permissions</Text>
            <Text style={dynamicStyles.settingValue}>Manage →</Text>
          </Pressable>
        </View>

        {/* Integrations */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>Integrations</Text>
          <Pressable style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>Calendar Sync</Text>
            <Text style={dynamicStyles.settingValue}>Not connected</Text>
          </Pressable>
          <Pressable style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>Messaging Platforms</Text>
            <Text style={dynamicStyles.settingValue}>{allowedMessaging.length} connected</Text>
          </Pressable>
        </View>

        {/* Privacy Controls */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>Privacy Controls</Text>
          <View style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>Data Collection</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.surfaceSecondary, true: theme.colors.text }}
              thumbColor={theme.colors.background}
            />
          </View>
          <Pressable style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>Privacy Policy</Text>
            <Text style={dynamicStyles.settingValue}>View →</Text>
          </Pressable>
          <Pressable style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>Delete Account</Text>
            <Text style={[dynamicStyles.settingValue, dynamicStyles.dangerText]}>Delete →</Text>
          </Pressable>
        </View>

        {/* Preferences */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>Preferences</Text>
          <View style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.surfaceSecondary, true: theme.colors.text }}
              thumbColor={theme.colors.background}
            />
          </View>
          <View style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>Theme</Text>
            <Switch
              value={theme.mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.surfaceSecondary, true: theme.colors.text }}
              thumbColor={theme.colors.background}
            />
          </View>
          <Pressable style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>Focus Mode</Text>
            <Text style={dynamicStyles.settingValue}>{mode} →</Text>
          </Pressable>
        </View>

        {/* App Info */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>About</Text>
          <Text style={dynamicStyles.appVersion}>Version 1.0.0</Text>
          <Text style={dynamicStyles.appDescription}>
            Breakfree helps you block distractions while keeping your important messages accessible.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

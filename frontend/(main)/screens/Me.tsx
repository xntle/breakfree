import * as React from 'react';
import { View, Text, ScrollView, Pressable, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboard } from '(onboard)/OnboardingContext';

export default function Me() {
  const { mode, blockedApps, allowedMessaging, setMode } = useOnboard();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Me</Text>
          <Text style={styles.subtitle}>Settings & preferences</Text>
        </View>

        {/* Profile Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Current Mode</Text>
            <Text style={styles.profileValue}>{mode} Mode</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Blocked Apps</Text>
            <Text style={styles.profileValue}>{blockedApps.length} apps</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Messaging Apps</Text>
            <Text style={styles.profileValue}>{allowedMessaging.length} apps</Text>
          </View>
        </View>

        {/* Device Management */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Management</Text>
          <Pressable style={styles.settingItem}>
            <Text style={styles.settingLabel}>Connected Devices</Text>
            <Text style={styles.settingValue}>1 device</Text>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <Text style={styles.settingLabel}>Screen Time Access</Text>
            <Text style={styles.settingValue}>Enabled</Text>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <Text style={styles.settingLabel}>App Permissions</Text>
            <Text style={styles.settingValue}>Manage →</Text>
          </Pressable>
        </View>

        {/* Integrations */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Integrations</Text>
          <Pressable style={styles.settingItem}>
            <Text style={styles.settingLabel}>Calendar Sync</Text>
            <Text style={styles.settingValue}>Not connected</Text>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <Text style={styles.settingLabel}>Messaging Platforms</Text>
            <Text style={styles.settingValue}>{allowedMessaging.length} connected</Text>
          </Pressable>
        </View>

        {/* Privacy Controls */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Privacy Controls</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Data Collection</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e5e5e5', true: '#000' }}
              thumbColor="#fff"
            />
          </View>
          <Pressable style={styles.settingItem}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Text style={styles.settingValue}>View →</Text>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <Text style={styles.settingLabel}>Delete Account</Text>
            <Text style={[styles.settingValue, styles.dangerText]}>Delete →</Text>
          </Pressable>
        </View>

        {/* Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferences</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e5e5e5', true: '#000' }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#333', true: '#ede9e9' }}
              thumbColor="#201f1f"
            />
          </View>
          <Pressable style={styles.settingItem}>
            <Text style={styles.settingLabel}>Focus Mode</Text>
            <Text style={styles.settingValue}>{mode} →</Text>
          </Pressable>
        </View>

        {/* App Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Breakfree helps you block distractions while keeping your important messages accessible.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#201f1f',
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
    color: '#ede9e9',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    marginBottom: 12,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileLabel: {
    fontSize: 14,
    color: '#999',
  },
  profileValue: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingLabel: {
    fontSize: 14,
    color: '#ede9e9',
    fontWeight: '500',
    fontFamily: 'OpenSans-Medium',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
  },
  dangerText: {
    color: '#ede9e9',
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
  },
  appVersion: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
});

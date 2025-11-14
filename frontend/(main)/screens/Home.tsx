import * as React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboard } from '(onboard)/OnboardingContext';

export default function Home() {
  const { blockedApps, allowedMessaging, mode } = useOnboard();
  const [streak, setStreak] = React.useState(7);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>Quick control hub</Text>
        </View>

        {/* Streak Tracker */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Streak</Text>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>days focused</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{blockedApps.length}</Text>
            <Text style={styles.statLabel}>Apps Blocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{allowedMessaging.length}</Text>
            <Text style={styles.statLabel}>Messaging Apps</Text>
          </View>
        </View>

        {/* Mode Display */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Mode</Text>
          <Text style={styles.modeText}>{mode} Mode</Text>
          <Text style={styles.cardSubtext}>
            {mode === 'Monk'
              ? 'Maximum focus with limited breaks'
              : 'Flexible focus with unlimited breaks'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Start Focus Session</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.actionButtonSecondary]}>
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
              View Schedule
            </Text>
          </Pressable>
        </View>

        {/* Mode Challenges */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Challenges</Text>
          <View style={styles.challengeItem}>
            <Text style={styles.challengeText}>Complete 2 focus sessions</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
          </View>
          <View style={styles.challengeItem}>
            <Text style={styles.challengeText}>Maintain focus for 4 hours</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>
          </View>
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
    maxWidth: 448, // max-w-md equivalent
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
  cardSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '800',
    fontFamily: 'OpenSans-ExtraBold',
    color: '#ede9e9',
    textAlign: 'center',
  },
  streakLabel: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'OpenSans-ExtraBold',
    color: '#ede9e9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  modeText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: '#ede9e9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonSecondary: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#ede9e9',
  },
  actionButtonText: {
    color: '#201f1f',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
  },
  actionButtonTextSecondary: {
    color: '#ede9e9',
  },
  challengeItem: {
    marginBottom: 16,
  },
  challengeText: {
    fontSize: 14,
    color: '#ede9e9',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ede9e9',
  },
});

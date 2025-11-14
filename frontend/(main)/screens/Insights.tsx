import * as React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboard } from '(onboard)/OnboardingContext';

export default function Insights() {
  const { blockedApps } = useOnboard();
  const timeSaved = 12.5; // hours
  const categoryBreakdown = [
    { category: 'Social Media', time: 6.2, percentage: 45 },
    { category: 'Entertainment', time: 4.1, percentage: 30 },
    { category: 'News', time: 2.2, percentage: 16 },
    { category: 'Other', time: 1.0, percentage: 9 },
  ];
  const topDistractions = [
    { app: 'Instagram', blocks: 42 },
    { app: 'TikTok', blocks: 38 },
    { app: 'Twitter', blocks: 31 },
    { app: 'YouTube', blocks: 28 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>Analytics dashboard</Text>
        </View>

        {/* Time Saved */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Time Saved This Week</Text>
          <Text style={styles.timeSavedNumber}>{timeSaved}h</Text>
          <Text style={styles.cardSubtext}>
            That's {Math.round(timeSaved * 60)} minutes of focused time
          </Text>
        </View>

        {/* Category Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Category Breakdown</Text>
          {categoryBreakdown.map((item) => (
            <View key={item.category} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{item.category}</Text>
                <Text style={styles.categoryTime}>{item.time}h</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${item.percentage}%` }]} />
              </View>
              <Text style={styles.categoryPercentage}>{item.percentage}%</Text>
            </View>
          ))}
        </View>

        {/* Top Distractions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Distractions</Text>
          {topDistractions.map((distraction, index) => (
            <View key={distraction.app} style={styles.distractionItem}>
              <View style={styles.distractionRank}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              <View style={styles.distractionContent}>
                <Text style={styles.distractionApp}>{distraction.app}</Text>
                <Text style={styles.distractionBlocks}>{distraction.blocks} blocks this week</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Insights */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Key Insights</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              • You're most distracted during afternoon hours (2-4 PM)
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>• Social media accounts for 45% of blocked time</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              • Focus sessions are 2.3x longer when scheduled in advance
            </Text>
          </View>
        </View>

        {/* Weekly Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>18h</Text>
            <Text style={styles.statLabel}>Focused</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
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
  cardSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  timeSavedNumber: {
    fontSize: 48,
    fontWeight: '800',
    fontFamily: 'OpenSans-ExtraBold',
    color: '#ede9e9',
    textAlign: 'center',
    marginVertical: 8,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
    color: '#ede9e9',
  },
  categoryTime: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ede9e9',
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#999',
  },
  distractionItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  distractionRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ede9e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#050505',
  },
  distractionContent: {
    flex: 1,
  },
  distractionApp: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    marginBottom: 2,
  },
  distractionBlocks: {
    fontSize: 12,
    color: '#999',
  },
  insightItem: {
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#ede9e9',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
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
});

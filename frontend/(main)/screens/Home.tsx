import * as React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from 'lucide-react-native';
import { useOnboard } from '(onboard)/OnboardingContext';

type Challenge = {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  type: 'focus' | 'break' | 'deep' | 'monk';
};

const INSPIRATIONAL_QUOTES = [
  'The way to get started is to quit talking and begin doing.',
  "Focus is not about saying yes to everything. It's about saying no to almost everything.",
  'Deep work is the ability to focus without distraction on a cognitively demanding task.',
  'Your mind is your greatest asset. Guard it fiercely.',
  'The best time to plant a tree was 20 years ago. The second best time is now.',
  'Success is the sum of small efforts repeated day in and day out.',
];

const QUICK_START_CHALLENGES: Challenge[] = [
  {
    id: '1',
    name: 'Deep Work 9-5',
    description: '8 hours of focused work',
    duration: 480, // 8 hours
    type: 'deep',
  },
  {
    id: '2',
    name: 'Monk Mode 24h',
    description: 'Complete digital detox',
    duration: 1440, // 24 hours
    type: 'monk',
  },
  {
    id: '3',
    name: 'Pomodoro Sprint',
    description: '25 minutes focused work',
    duration: 25,
    type: 'focus',
  },
  {
    id: '4',
    name: 'Short Break',
    description: '20 minute recharge',
    duration: 20,
    type: 'break',
  },
  {
    id: '5',
    name: 'Deep Focus 2h',
    description: '2 hours uninterrupted',
    duration: 120,
    type: 'deep',
  },
  {
    id: '6',
    name: 'Power Hour',
    description: '60 minutes maximum focus',
    duration: 60,
    type: 'focus',
  },
];

type TabType = 'timer' | 'schedule';

const DISTRACTION_APPS = [
  { id: 'instagram', label: 'Instagram', emoji: '📸' },
  { id: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { id: 'twitter', label: 'X (Twitter)', emoji: '🐦' },
  { id: 'facebook', label: 'Facebook', emoji: '👥' },
  { id: 'youtube', label: 'YouTube', emoji: '▶️' },
  { id: 'reddit', label: 'Reddit', emoji: '🤖' },
  { id: 'news', label: 'News', emoji: '📰' },
  { id: 'games', label: 'Games', emoji: '🎮' },
];

export default function Home() {
  const { mode, blockedApps, setBlockedApps } = useOnboard();
  const [activeTab, setActiveTab] = React.useState<TabType>('timer');
  const [showBlockedAppsModal, setShowBlockedAppsModal] = React.useState(false);
  const [sliderWidth, setSliderWidth] = React.useState(0);
  const [quote] = React.useState(
    INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)]
  );
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(25 * 60); // 25 minutes in seconds
  const [selectedChallenge, setSelectedChallenge] = React.useState<Challenge | null>(null);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (timeRemaining === 0) {
      setTimeRemaining(25 * 60); // Default to 25 minutes
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(25 * 60);
    setSelectedChallenge(null);
  };

  const handleChallengePress = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setTimeRemaining(challenge.duration * 60);
    setIsRunning(false);
  };

  const adjustTime = (minutes: number) => {
    if (isRunning) return; // Don't allow adjustment while running
    const newTime = Math.max(60, Math.min(480 * 60, timeRemaining + minutes * 60)); // 1 min to 8 hours
    setTimeRemaining(newTime);
    setSelectedChallenge(null);
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'deep':
        return '#ede9e9';
      case 'monk':
        return '#999';
      case 'break':
        return '#666';
      default:
        return '#ede9e9';
    }
  };

  const toggleAppBlock = (appId: string) => {
    if (blockedApps.includes(appId)) {
      setBlockedApps(blockedApps.filter((id) => id !== appId));
    } else {
      setBlockedApps([...blockedApps, appId]);
    }
  };

  const handleSliderChange = (value: number) => {
    if (isRunning) return;
    const minutes = Math.round(value);
    const newTime = Math.max(1, Math.min(480, minutes)) * 60; // 1 min to 8 hours
    setTimeRemaining(newTime);
    setSelectedChallenge(null);
  };

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isRunning,
        onMoveShouldSetPanResponder: () => !isRunning,
        onPanResponderGrant: (evt) => {
          if (isRunning || sliderWidth === 0) return;
          const { locationX } = evt.nativeEvent;
          const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
          const minutes = Math.round(1 + percentage * 479); // 1 to 480 minutes
          handleSliderChange(minutes);
        },
        onPanResponderMove: (evt) => {
          if (isRunning || sliderWidth === 0) return;
          const { locationX } = evt.nativeEvent;
          const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
          const minutes = Math.round(1 + percentage * 479); // 1 to 480 minutes
          handleSliderChange(minutes);
        },
      }),
    [isRunning, sliderWidth]
  );

  const renderTimerView = () => (
    <>
      {/* Inspirational Quote */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>"{quote}"</Text>
      </View>

      {/* Pomodoro Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        {!isRunning && (
          <View
            style={styles.sliderContainer}
            onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
            {...panResponder.panHandlers}>
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderFill,
                  {
                    width: `${((timeRemaining / 60 - 1) / 479) * 100}%`,
                  },
                ]}
              />
              <View
                style={[
                  styles.sliderThumb,
                  {
                    left: `${((timeRemaining / 60 - 1) / 479) * 100}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>1m</Text>
              <Text style={styles.sliderLabel}>8h</Text>
            </View>
          </View>
        )}
        <View style={styles.timerButtons}>
          {!isRunning ? (
            <Pressable style={styles.timerButton} onPress={handleStart}>
              <Text style={styles.timerButtonText}>Start</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                style={[styles.timerButton, styles.timerButtonPause]}
                onPress={handlePause}>
                <Text style={[styles.timerButtonText, styles.timerButtonTextPause]}>Pause</Text>
              </Pressable>
              <Pressable
                style={[styles.timerButton, styles.timerButtonReset]}
                onPress={handleReset}>
                <Text style={[styles.timerButtonText, styles.timerButtonTextReset]}>Reset</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* Apps Blocked Banner */}
      <Pressable
        onPress={() => setShowBlockedAppsModal(true)}
        style={[
          styles.appsBlockedBanner,
          blockedApps.length === 0 && styles.appsBlockedBannerEmpty,
        ]}>
        <Text style={styles.appsBlockedText}>
          {blockedApps.length > 0
            ? `${blockedApps.length} app${blockedApps.length > 1 ? 's' : ''} blocked`
            : 'Manage blocked apps'}
        </Text>
      </Pressable>

      {/* Blocked Apps Modal */}
      {showBlockedAppsModal && (
        <Pressable style={styles.modalOverlay} onPress={() => setShowBlockedAppsModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Blocked Apps</Text>
              <Pressable onPress={() => setShowBlockedAppsModal(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.appsGrid}>
                {DISTRACTION_APPS.map((app) => {
                  const isBlocked = blockedApps.includes(app.id);
                  return (
                    <Pressable
                      key={app.id}
                      style={[styles.appChip, isBlocked && styles.appChipBlocked]}
                      onPress={() => toggleAppBlock(app.id)}>
                      <Text style={styles.appEmoji}>{app.emoji}</Text>
                      <Text style={[styles.appLabel, isBlocked && styles.appLabelBlocked]}>
                        {app.label}
                      </Text>
                      {isBlocked && (
                        <View style={styles.blockedIndicator}>
                          <Text style={styles.blockedIndicatorText}>✓</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      )}

      {/* Quick Start Challenges */}
      <View style={styles.challengesContainer}>
        <Text style={styles.sectionTitle}>Quick Start Challenges</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.challengesScroll}>
          {QUICK_START_CHALLENGES.map((challenge) => (
            <Pressable
              key={challenge.id}
              style={[
                styles.challengeCard,
                selectedChallenge?.id === challenge.id && styles.challengeCardSelected,
              ]}
              onPress={() => handleChallengePress(challenge)}>
              <Text style={[styles.challengeName, { color: getChallengeColor(challenge.type) }]}>
                {challenge.name}
              </Text>
              <Text style={styles.challengeDescription}>{challenge.description}</Text>
              <Text style={styles.challengeDuration}>
                {challenge.duration >= 60
                  ? `${Math.floor(challenge.duration / 60)}h ${challenge.duration % 60}m`
                  : `${challenge.duration}m`}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </>
  );

  const renderScheduleView = () => (
    <>
      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleTitle}>Today's Schedule</Text>
        <Text style={styles.scheduleSubtitle}>Plan your focus sessions</Text>

        {/* Schedule Items */}
        <View style={styles.scheduleList}>
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.scheduleTimeText}>09:00</Text>
              <Text style={styles.scheduleTimeLabel}>AM</Text>
            </View>
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleItemTitle}>Deep Work Session</Text>
              <Text style={styles.scheduleItemDescription}>2 hours focused work</Text>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.scheduleTimeText}>11:00</Text>
              <Text style={styles.scheduleTimeLabel}>AM</Text>
            </View>
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleItemTitle}>Short Break</Text>
              <Text style={styles.scheduleItemDescription}>20 minute recharge</Text>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.scheduleTimeText}>02:00</Text>
              <Text style={styles.scheduleTimeLabel}>PM</Text>
            </View>
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleItemTitle}>Pomodoro Sprint</Text>
              <Text style={styles.scheduleItemDescription}>25 minutes focused work</Text>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.scheduleTimeText}>05:00</Text>
              <Text style={styles.scheduleTimeLabel}>PM</Text>
            </View>
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleItemTitle}>End of Day Review</Text>
              <Text style={styles.scheduleItemDescription}>Reflect on progress</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.addScheduleButton}>
          <Text style={styles.addScheduleButtonText}>+ Add Schedule Item</Text>
        </Pressable>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logoText}>breakfree</Text>
        </View>
        <Pressable style={styles.profileButton}>
          <User size={20} color="#ede9e9" strokeWidth={2} fill="#ede9e9" />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'timer' && styles.tabActive]}
          onPress={() => setActiveTab('timer')}>
          <Text style={[styles.tabText, activeTab === 'timer' && styles.tabTextActive]}>Timer</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'schedule' && styles.tabActive]}
          onPress={() => setActiveTab('schedule')}>
          <Text style={[styles.tabText, activeTab === 'schedule' && styles.tabTextActive]}>
            Schedule
          </Text>
        </Pressable>
      </View>

      {/* App Blocked Banner */}
      {(isRunning || blockedApps.length > 0) && (
        <View style={styles.blockedBanner}>
          <Text style={styles.blockedBannerText}>
            🔒{' '}
            {blockedApps.length > 0
              ? `${blockedApps.length} app${blockedApps.length > 1 ? 's' : ''} blocked`
              : 'Focus mode active'}
          </Text>
        </View>
      )}

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'timer' ? renderTimerView() : renderScheduleView()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#201f1f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  headerLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    fontWeight: '700',
  },
  profileButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
    gap: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    backgroundColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#ede9e9',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Medium',
    color: '#666',
  },
  tabTextActive: {
    color: '#ede9e9',
    fontFamily: 'OpenSans-Bold',
  },
  blockedBanner: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockedBannerText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Medium',
    color: '#ede9e9',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    maxWidth: 448,
    alignSelf: 'center',
    width: '100%',
  },
  quoteContainer: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  quoteText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#ede9e9',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
  timerContainer: {
    backgroundColor: 'transparent',
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  timerAdjustContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  timerAdjustButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 50,
    alignItems: 'center',
  },
  timerAdjustText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
  },
  timerAdjustTextDisabled: {
    color: '#666',
    opacity: 0.5,
  },
  timerText: {
    fontSize: 72,
    fontFamily: 'OpenSans-ExtraBold',
    fontWeight: '800',
    color: '#ede9e9',
    marginVertical: 16,
    letterSpacing: -3,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  appsBlockedBanner: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 24,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  appsBlockedBannerEmpty: {
    opacity: 0.6,
  },
  appsBlockedText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Medium',
    color: '#ede9e9',
    textAlign: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#201f1f',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    color: '#ede9e9',
  },
  modalScroll: {
    maxHeight: 500,
  },
  appsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  appChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 12,
    minWidth: '45%',
    position: 'relative',
  },
  appChipBlocked: {
    borderColor: '#ede9e9',
    backgroundColor: '#333',
  },
  appEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  appLabel: {
    fontSize: 14,
    fontFamily: 'OpenSans-Medium',
    color: '#ede9e9',
    flex: 1,
  },
  appLabelBlocked: {
    fontFamily: 'OpenSans-Bold',
  },
  blockedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ede9e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  blockedIndicatorText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
    color: '#201f1f',
  },
  sliderContainer: {
    width: '100%',
    marginTop: 24,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    position: 'relative',
    marginBottom: 8,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#ede9e9',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ede9e9',
    position: 'absolute',
    top: -8,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: '#201f1f',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
  },
  timerButton: {
    flex: 1,
    backgroundColor: '#ede9e9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  timerButtonPause: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#ede9e9',
  },
  timerButtonReset: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#666',
  },
  timerButtonText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    color: '#201f1f',
    fontWeight: '700',
  },
  timerButtonTextPause: {
    color: '#ede9e9',
  },
  timerButtonTextReset: {
    color: '#666',
  },
  challengesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    marginBottom: 12,
  },
  challengesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  challengeCard: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 160,
    minHeight: 120,
  },
  challengeCardSelected: {
    borderColor: '#ede9e9',
    borderWidth: 2,
  },
  challengeName: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
    marginBottom: 8,
  },
  challengeDuration: {
    fontSize: 14,
    fontFamily: 'OpenSans-Medium',
    color: '#ede9e9',
    marginTop: 'auto',
  },
  scheduleContainer: {
    paddingTop: 20,
  },
  scheduleTitle: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    marginBottom: 4,
  },
  scheduleSubtitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
    marginBottom: 24,
  },
  scheduleList: {
    marginBottom: 24,
  },
  scheduleItem: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  scheduleTime: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  scheduleTimeText: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
  },
  scheduleTimeLabel: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
    marginTop: 2,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleItemTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    marginBottom: 4,
  },
  scheduleItemDescription: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
  },
  addScheduleButton: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addScheduleButtonText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Medium',
    color: '#999',
  },
});

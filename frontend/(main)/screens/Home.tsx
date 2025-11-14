import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  PanResponder,
  Image,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { User } from 'lucide-react-native';
import { useOnboard } from '(onboard)/OnboardingContext';
import { useTheme } from '../../contexts/ThemeContext';
import type { RootStackParamList } from 'App';
import type { MainTabParamList } from '../Tabs';

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
  const { theme } = useTheme();
  const { mode, blockedApps, setBlockedApps } = useOnboard();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const tabNavigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const [activeTab, setActiveTab] = React.useState<TabType>('timer');
  const [showBlockedAppsModal, setShowBlockedAppsModal] = React.useState(false);
  const [sliderWidth, setSliderWidth] = React.useState(0);
  const [quote] = React.useState(
    INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)]
  );
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(25 * 60); // 25 minutes in seconds
  const [selectedChallenge, setSelectedChallenge] = React.useState<Challenge | null>(null);

  // Animation values for smooth transitions
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  // Animate tab transition
  const animateTabChange = React.useCallback(
    (newTab: TabType) => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: newTab === 'schedule' ? 20 : -20,
          duration: 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveTab(newTab);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [fadeAnim, slideAnim]
  );

  // Swipe gesture for tab switching and navigation
  const swipeResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          // Only respond to horizontal swipes (dx > dy and significant horizontal movement)
          const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
          const isSignificant = Math.abs(gestureState.dx) > 15;

          // Check if swipe starts from screen edges (left or right 50px) to avoid conflicts with ScrollViews
          const screenWidth = Dimensions.get('window').width;
          const startX = evt.nativeEvent.pageX || 0;
          const isFromEdge = startX < 50 || startX > screenWidth - 50;

          // Also check if the swipe is long enough and horizontal enough
          const isLongSwipe = Math.abs(gestureState.dx) > 100;

          return isHorizontal && isSignificant && (isFromEdge || isLongSwipe);
        },
        onPanResponderRelease: (evt, gestureState) => {
          const { dx } = gestureState;
          const swipeThreshold = 80; // Increased threshold to avoid conflicts

          if (Math.abs(dx) > swipeThreshold) {
            if (dx > 0) {
              // Swipe right: go to Timer
              if (activeTab === 'schedule') {
                animateTabChange('timer');
              }
            } else {
              // Swipe left
              if (activeTab === 'timer') {
                animateTabChange('schedule');
              } else if (activeTab === 'schedule') {
                // Navigate to Messages tab with smooth transition
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 200,
                  easing: Easing.out(Easing.ease),
                  useNativeDriver: true,
                }).start(() => {
                  tabNavigation.navigate('Messages');
                });
              }
            }
          }
        },
      }),
    [activeTab, tabNavigation, animateTabChange, fadeAnim]
  );

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
        return theme.colors.text;
      case 'monk':
        return theme.colors.textSecondary;
      case 'break':
        return theme.colors.textTertiary;
      default:
        return theme.colors.text;
    }
  };

  // Generate dynamic styles based on theme
  const dynamicStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        headerBlur: {
          overflow: 'hidden',
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 8,
          backgroundColor: theme.colors.blurBackground,
        },
        profileButtonBlur: {
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: theme.colors.blurSurface,
          borderWidth: 1,
          borderColor: theme.colors.blurBorder,
        },
        profileButton: {
          width: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabsBlur: {
          overflow: 'hidden',
        },
        tabsContainer: {
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 6,
          gap: 0,
          backgroundColor: theme.colors.blurBackground,
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
          borderBottomColor: theme.colors.text,
        },
        tabText: {
          fontSize: 14,
          fontFamily: 'OpenSans-Medium',
          color: theme.colors.textTertiary,
        },
        tabTextActive: {
          color: theme.colors.text,
          fontFamily: 'OpenSans-Bold',
        },
        blockedBannerBlur: {
          overflow: 'hidden',
        },
        blockedBanner: {
          paddingVertical: 8,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.blurSurface,
        },
        blockedBannerContent: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        },
        blockedIconsContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        },
        blockedIcon: {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: theme.colors.surfaceSecondary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        blockedIconEmoji: {
          fontSize: 14,
        },
        blockedBannerRemaining: {
          fontSize: 12,
          fontFamily: 'OpenSans-Medium',
          color: theme.colors.textSecondary,
        },
        blockedBannerText: {
          fontSize: 12,
          fontFamily: 'OpenSans-Medium',
          color: theme.colors.text,
        },
        contentContainer: {
          flex: 1,
        },
        animatedContent: {
          flex: 1,
        },
        scrollContent: {
          padding: 20,
          paddingBottom: 100,
          maxWidth: 448,
          alignSelf: 'center',
          width: '100%',
        },
        quoteContainer: {
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          backgroundColor: theme.colors.blurSurface,
          borderWidth: 1,
          borderColor: theme.colors.blurBorder,
          overflow: 'hidden',
        },
        quoteText: {
          fontSize: 16,
          fontFamily: 'OpenSans-Regular',
          color: theme.colors.text,
          fontStyle: 'italic',
          textAlign: 'center',
          lineHeight: 24,
        },
        timerContainer: {
          padding: 24,
          marginBottom: 24,
          alignItems: 'center',
          backgroundColor: theme.colors.blurSurface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.blurBorder,
          overflow: 'hidden',
        },
        timerText: {
          fontSize: 72,
          fontFamily: 'OpenSans-ExtraBold',
          fontWeight: '800',
          color: theme.colors.text,
          marginVertical: 16,
          letterSpacing: -3,
        },
        timerButtons: {
          flexDirection: 'row',
          gap: 12,
          width: '100%',
          marginTop: 8,
        },
        timerButtonBlur: {
          flex: 1,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: theme.colors.primaryLight,
          borderWidth: 1,
          borderColor: theme.colors.blurBorder,
        },
        timerButton: {
          flex: 1,
          paddingVertical: 14,
          alignItems: 'center',
        },
        timerButtonPause: {
          backgroundColor: theme.colors.blurSurface,
          borderWidth: 1,
          borderColor: theme.colors.blurBorder,
        },
        timerButtonReset: {
          backgroundColor: theme.colors.blurSurface,
          borderWidth: 1,
          borderColor: theme.colors.textTertiary,
        },
        timerButtonText: {
          fontSize: 16,
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.background,
          fontWeight: '700',
        },
        timerButtonTextPause: {
          color: theme.colors.text,
        },
        timerButtonTextReset: {
          color: theme.colors.textTertiary,
        },
        sliderContainer: {
          width: '100%',
          marginTop: 24,
        },
        sliderTrack: {
          height: 4,
          backgroundColor: theme.colors.surfaceSecondary,
          borderRadius: 2,
          position: 'relative',
          marginBottom: 8,
        },
        sliderFill: {
          height: '100%',
          backgroundColor: theme.colors.text,
          borderRadius: 2,
          position: 'absolute',
          left: 0,
          top: 0,
        },
        sliderThumb: {
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: theme.colors.text,
          position: 'absolute',
          top: -8,
          marginLeft: -10,
          borderWidth: 2,
          borderColor: theme.colors.background,
        },
        sliderLabels: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 4,
        },
        sliderLabel: {
          fontSize: 12,
          fontFamily: 'OpenSans-Regular',
          color: theme.colors.textSecondary,
        },
        challengesContainer: {
          marginBottom: 24,
        },
        sectionTitle: {
          fontSize: 20,
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
          marginBottom: 12,
        },
        challengesScroll: {
          marginHorizontal: -20,
          paddingHorizontal: 20,
        },
        challengeCardBlur: {
          borderRadius: 16,
          marginRight: 12,
          width: 160,
          minHeight: 120,
          overflow: 'hidden',
          backgroundColor: theme.colors.blurSurface,
          borderWidth: 1,
          borderColor: theme.colors.blurBorder,
        },
        challengeCardSelected: {
          borderColor: theme.colors.text,
          borderWidth: 2,
        },
        challengeCard: {
          padding: 16,
        },
        challengeName: {
          fontSize: 16,
          fontFamily: 'OpenSans-Bold',
          marginBottom: 4,
        },
        challengeDescription: {
          fontSize: 12,
          fontFamily: 'OpenSans-Regular',
          color: theme.colors.textSecondary,
          marginBottom: 8,
        },
        challengeDuration: {
          fontSize: 14,
          fontFamily: 'OpenSans-Medium',
          color: theme.colors.text,
          marginTop: 'auto',
        },
        scheduleContainer: {
          paddingTop: 20,
        },
        scheduleTitle: {
          fontSize: 24,
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
          marginBottom: 4,
        },
        scheduleSubtitle: {
          fontSize: 14,
          fontFamily: 'OpenSans-Regular',
          color: theme.colors.textSecondary,
          marginBottom: 24,
        },
        scheduleList: {
          marginBottom: 24,
        },
        scheduleItemBlur: {
          borderRadius: 16,
          marginBottom: 12,
          overflow: 'hidden',
          backgroundColor: theme.colors.blurSurface,
          borderWidth: 1,
          borderColor: theme.colors.blurBorder,
        },
        scheduleItem: {
          flexDirection: 'row',
          padding: 16,
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
          color: theme.colors.text,
        },
        scheduleTimeLabel: {
          fontSize: 12,
          fontFamily: 'OpenSans-Regular',
          color: theme.colors.textSecondary,
          marginTop: 2,
        },
        scheduleContent: {
          flex: 1,
        },
        scheduleItemTitle: {
          fontSize: 16,
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
          marginBottom: 4,
        },
        scheduleItemDescription: {
          fontSize: 14,
          fontFamily: 'OpenSans-Regular',
          color: theme.colors.textSecondary,
        },
        addScheduleButtonBlur: {
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: theme.colors.blurSurface,
          borderWidth: 1,
          borderColor: theme.colors.blurBorder,
          borderStyle: 'dashed',
        },
        addScheduleButton: {
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
        },
        addScheduleButtonText: {
          fontSize: 16,
          fontFamily: 'OpenSans-Medium',
          color: theme.colors.textSecondary,
        },
        modalOverlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'flex-end',
        },
        modalContent: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '80%',
          overflow: 'hidden',
          backgroundColor: theme.colors.blurBackground,
        },
        modalContentInner: {
          paddingTop: 20,
          paddingBottom: 40,
        },
        modalHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        modalTitle: {
          fontSize: 24,
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
        },
        closeButton: {
          width: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
        },
        closeButtonText: {
          fontSize: 28,
          color: theme.colors.text,
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
        appChipBlur: {
          borderRadius: 12,
          overflow: 'hidden',
          minWidth: '45%',
          backgroundColor: theme.colors.blurSurface,
          borderWidth: 1,
          borderColor: theme.colors.blurBorder,
        },
        appChipBlocked: {
          borderColor: theme.colors.text,
          backgroundColor: theme.colors.surfaceSecondary,
        },
        appChip: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          position: 'relative',
        },
        appEmoji: {
          fontSize: 20,
          marginRight: 8,
        },
        appLabel: {
          fontSize: 14,
          fontFamily: 'OpenSans-Medium',
          color: theme.colors.text,
          flex: 1,
        },
        appLabelBlocked: {
          fontFamily: 'OpenSans-Bold',
        },
        blockedIndicator: {
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: theme.colors.text,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 8,
        },
        blockedIndicatorText: {
          fontSize: 12,
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.background,
        },
        logoText: {
          fontSize: 18,
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
          fontWeight: '700',
        },
        headerLeft: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        logo: {
          width: 24,
          height: 24,
          resizeMode: 'contain',
        },
      }),
    [theme]
  );

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
      <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.quoteContainer}>
        <Text style={dynamicStyles.quoteText}>"{quote}"</Text>
      </BlurView>

      {/* Pomodoro Timer */}
      <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.timerContainer}>
        <Text style={dynamicStyles.timerText}>{formatTime(timeRemaining)}</Text>
        {!isRunning && (
          <View
            style={dynamicStyles.sliderContainer}
            onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
            {...panResponder.panHandlers}>
            <View style={dynamicStyles.sliderTrack}>
              <View
                style={[
                  dynamicStyles.sliderFill,
                  {
                    width: `${((timeRemaining / 60 - 1) / 479) * 100}%`,
                  },
                ]}
              />
              <View
                style={[
                  dynamicStyles.sliderThumb,
                  {
                    left: `${((timeRemaining / 60 - 1) / 479) * 100}%`,
                  },
                ]}
              />
            </View>
            <View style={dynamicStyles.sliderLabels}>
              <Text style={dynamicStyles.sliderLabel}>1m</Text>
              <Text style={dynamicStyles.sliderLabel}>8h</Text>
            </View>
          </View>
        )}
        <View style={dynamicStyles.timerButtons}>
          {!isRunning ? (
            <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.timerButtonBlur}>
              <Pressable style={dynamicStyles.timerButton} onPress={handleStart}>
                <Text style={dynamicStyles.timerButtonText}>Start</Text>
              </Pressable>
            </BlurView>
          ) : (
            <>
              <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.timerButtonBlur}>
                <Pressable
                  style={[dynamicStyles.timerButton, dynamicStyles.timerButtonPause]}
                  onPress={handlePause}>
                  <Text style={[dynamicStyles.timerButtonText, dynamicStyles.timerButtonTextPause]}>
                    Pause
                  </Text>
                </Pressable>
              </BlurView>
              <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.timerButtonBlur}>
                <Pressable
                  style={[dynamicStyles.timerButton, dynamicStyles.timerButtonReset]}
                  onPress={handleReset}>
                  <Text style={[dynamicStyles.timerButtonText, dynamicStyles.timerButtonTextReset]}>
                    Reset
                  </Text>
                </Pressable>
              </BlurView>
            </>
          )}
        </View>
      </BlurView>

      {/* Blocked Apps Modal */}
      {showBlockedAppsModal && (
        <Pressable
          style={dynamicStyles.modalOverlay}
          onPress={() => setShowBlockedAppsModal(false)}>
          <BlurView intensity={80} tint={theme.mode} style={dynamicStyles.modalContent}>
            <Pressable onPress={(e) => e.stopPropagation()} style={dynamicStyles.modalContentInner}>
              <View style={dynamicStyles.modalHeader}>
                <Text style={dynamicStyles.modalTitle}>Blocked Apps</Text>
                <Pressable
                  onPress={() => setShowBlockedAppsModal(false)}
                  style={dynamicStyles.closeButton}>
                  <Text style={dynamicStyles.closeButtonText}>×</Text>
                </Pressable>
              </View>
              <ScrollView style={dynamicStyles.modalScroll} showsVerticalScrollIndicator={false}>
                <View style={dynamicStyles.appsGrid}>
                  {DISTRACTION_APPS.map((app) => {
                    const isBlocked = blockedApps.includes(app.id);
                    return (
                      <BlurView
                        key={app.id}
                        intensity={60}
                        tint={theme.mode}
                        style={[
                          dynamicStyles.appChipBlur,
                          isBlocked && dynamicStyles.appChipBlocked,
                        ]}>
                        <Pressable
                          style={dynamicStyles.appChip}
                          onPress={() => toggleAppBlock(app.id)}>
                          <Text style={dynamicStyles.appEmoji}>{app.emoji}</Text>
                          <Text
                            style={[
                              dynamicStyles.appLabel,
                              isBlocked && dynamicStyles.appLabelBlocked,
                            ]}>
                            {app.label}
                          </Text>
                          {isBlocked && (
                            <View style={dynamicStyles.blockedIndicator}>
                              <Text style={dynamicStyles.blockedIndicatorText}>✓</Text>
                            </View>
                          )}
                        </Pressable>
                      </BlurView>
                    );
                  })}
                </View>
              </ScrollView>
            </Pressable>
          </BlurView>
        </Pressable>
      )}

      {/* Quick Start Challenges */}
      <View style={dynamicStyles.challengesContainer}>
        <Text style={dynamicStyles.sectionTitle}>Quick Start Challenges</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={dynamicStyles.challengesScroll}>
          {QUICK_START_CHALLENGES.map((challenge) => (
            <BlurView
              key={challenge.id}
              intensity={60}
              tint={theme.mode}
              style={[
                dynamicStyles.challengeCardBlur,
                selectedChallenge?.id === challenge.id && dynamicStyles.challengeCardSelected,
              ]}>
              <Pressable
                style={dynamicStyles.challengeCard}
                onPress={() => handleChallengePress(challenge)}>
                <Text
                  style={[
                    dynamicStyles.challengeName,
                    { color: getChallengeColor(challenge.type) },
                  ]}>
                  {challenge.name}
                </Text>
                <Text style={dynamicStyles.challengeDescription}>{challenge.description}</Text>
                <Text style={dynamicStyles.challengeDuration}>
                  {challenge.duration >= 60
                    ? `${Math.floor(challenge.duration / 60)}h ${challenge.duration % 60}m`
                    : `${challenge.duration}m`}
                </Text>
              </Pressable>
            </BlurView>
          ))}
        </ScrollView>
      </View>
    </>
  );

  const renderScheduleView = () => (
    <>
      <View style={dynamicStyles.scheduleContainer}>
        <Text style={dynamicStyles.scheduleTitle}>Today's Schedule</Text>
        <Text style={dynamicStyles.scheduleSubtitle}>Plan your focus sessions</Text>

        {/* Schedule Items */}
        <View style={dynamicStyles.scheduleList}>
          <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.scheduleItemBlur}>
            <View style={dynamicStyles.scheduleItem}>
              <View style={dynamicStyles.scheduleTime}>
                <Text style={dynamicStyles.scheduleTimeText}>09:00</Text>
                <Text style={dynamicStyles.scheduleTimeLabel}>AM</Text>
              </View>
              <View style={dynamicStyles.scheduleContent}>
                <Text style={dynamicStyles.scheduleItemTitle}>Deep Work Session</Text>
                <Text style={dynamicStyles.scheduleItemDescription}>2 hours focused work</Text>
              </View>
            </View>
          </BlurView>

          <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.scheduleItemBlur}>
            <View style={dynamicStyles.scheduleItem}>
              <View style={dynamicStyles.scheduleTime}>
                <Text style={dynamicStyles.scheduleTimeText}>11:00</Text>
                <Text style={dynamicStyles.scheduleTimeLabel}>AM</Text>
              </View>
              <View style={dynamicStyles.scheduleContent}>
                <Text style={dynamicStyles.scheduleItemTitle}>Short Break</Text>
                <Text style={dynamicStyles.scheduleItemDescription}>20 minute recharge</Text>
              </View>
            </View>
          </BlurView>

          <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.scheduleItemBlur}>
            <View style={dynamicStyles.scheduleItem}>
              <View style={dynamicStyles.scheduleTime}>
                <Text style={dynamicStyles.scheduleTimeText}>02:00</Text>
                <Text style={dynamicStyles.scheduleTimeLabel}>PM</Text>
              </View>
              <View style={dynamicStyles.scheduleContent}>
                <Text style={dynamicStyles.scheduleItemTitle}>Pomodoro Sprint</Text>
                <Text style={dynamicStyles.scheduleItemDescription}>25 minutes focused work</Text>
              </View>
            </View>
          </BlurView>

          <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.scheduleItemBlur}>
            <View style={dynamicStyles.scheduleItem}>
              <View style={dynamicStyles.scheduleTime}>
                <Text style={dynamicStyles.scheduleTimeText}>05:00</Text>
                <Text style={dynamicStyles.scheduleTimeLabel}>PM</Text>
              </View>
              <View style={dynamicStyles.scheduleContent}>
                <Text style={dynamicStyles.scheduleItemTitle}>End of Day Review</Text>
                <Text style={dynamicStyles.scheduleItemDescription}>Reflect on progress</Text>
              </View>
            </View>
          </BlurView>
        </View>

        <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.addScheduleButtonBlur}>
          <Pressable style={dynamicStyles.addScheduleButton}>
            <Text style={dynamicStyles.addScheduleButtonText}>+ Add Schedule Item</Text>
          </Pressable>
        </BlurView>
      </View>
    </>
  );

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      {/* Header */}
      <BlurView intensity={80} tint={theme.mode} style={dynamicStyles.headerBlur}>
        <View style={dynamicStyles.header}>
          <View style={dynamicStyles.headerLeft}>
            <Image source={require('../../assets/logo.png')} style={dynamicStyles.logo} />
            <Text style={dynamicStyles.logoText}>breakfree</Text>
          </View>
          <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.profileButtonBlur}>
            <Pressable
              style={dynamicStyles.profileButton}
              onPress={() => {
                const parent = navigation.getParent();
                if (parent) {
                  (parent as any).navigate('Me');
                }
              }}>
              <User size={20} color={theme.colors.text} strokeWidth={2} fill={theme.colors.text} />
            </Pressable>
          </BlurView>
        </View>
      </BlurView>

      {/* Tabs */}
      <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.tabsBlur}>
        <View style={dynamicStyles.tabsContainer}>
          <Pressable
            style={[dynamicStyles.tab, activeTab === 'timer' && dynamicStyles.tabActive]}
            onPress={() => animateTabChange('timer')}>
            <Text
              style={[dynamicStyles.tabText, activeTab === 'timer' && dynamicStyles.tabTextActive]}>
              Timer
            </Text>
          </Pressable>
          <Pressable
            style={[dynamicStyles.tab, activeTab === 'schedule' && dynamicStyles.tabActive]}
            onPress={() => animateTabChange('schedule')}>
            <Text
              style={[
                dynamicStyles.tabText,
                activeTab === 'schedule' && dynamicStyles.tabTextActive,
              ]}>
              Schedule
            </Text>
          </Pressable>
        </View>
      </BlurView>

      {/* App Blocked Banner */}
      {(isRunning || blockedApps.length > 0) && (
        <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.blockedBannerBlur}>
          <Pressable
            onPress={() => setShowBlockedAppsModal(true)}
            style={dynamicStyles.blockedBanner}>
            <View style={dynamicStyles.blockedBannerContent}>
              {blockedApps.length > 0 ? (
                <>
                  <View style={dynamicStyles.blockedIconsContainer}>
                    {blockedApps.slice(0, 2).map((appId) => {
                      const app = DISTRACTION_APPS.find((a) => a.id === appId);
                      return app ? (
                        <View key={appId} style={dynamicStyles.blockedIcon}>
                          <Text style={dynamicStyles.blockedIconEmoji}>{app.emoji}</Text>
                        </View>
                      ) : null;
                    })}
                  </View>
                  {blockedApps.length > 2 && (
                    <Text style={dynamicStyles.blockedBannerRemaining}>
                      +{blockedApps.length - 2}
                    </Text>
                  )}
                </>
              ) : (
                <Text style={dynamicStyles.blockedBannerText}>🔒 Focus mode active</Text>
              )}
            </View>
          </Pressable>
        </BlurView>
      )}

      {/* Content */}
      <View style={dynamicStyles.contentContainer} {...swipeResponder.panHandlers}>
        <Animated.View
          style={[
            dynamicStyles.animatedContent,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}>
          <ScrollView
            contentContainerStyle={dynamicStyles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {activeTab === 'timer' ? renderTimerView() : renderScheduleView()}
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

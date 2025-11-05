// Welcome.tsx
import { View, Animated, Easing, Pressable, Text } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

function useFloatFadeUp(delay = 0, dy = 12, dur = 600) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(dy)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: dur,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: dur,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();
  }, [delay, dur, dy, opacity, translateY]);
  return { style: { opacity, transform: [{ translateY }] } };
}

export default function Welcome() {
  const nav = useNavigation<any>();

  // New: screen & “yes” entrance anims
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const yesOpacity = useRef(new Animated.Value(0)).current;
  const yesScale = useRef(new Animated.Value(0.95)).current;

  // Header lines: more staggered
  const a = useFloatFadeUp(250, 16, 700); // “are you ready to”
  const b = useFloatFadeUp(500, 18, 750); // “breakfree?”
  const c = { style: { opacity: yesOpacity, transform: [{ scale: yesScale }] } };

  useEffect(() => {
    // Screen fade-in → then reveal “yes”
    Animated.sequence([
      Animated.timing(screenOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.delay(450),
      Animated.parallel([
        Animated.timing(yesOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(yesScale, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();
  }, [screenOpacity, yesOpacity, yesScale]);

  // Hold-to-navigate
  const HOLD_MS = 2000;
  const circleScale = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didFire = useRef(false);
  const [pressed, setPressed] = useState(false);

  const startHold = () => {
    setPressed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    didFire.current = false;
    Animated.timing(circleScale, {
      toValue: 1,
      duration: HOLD_MS,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
    timer.current = setTimeout(async () => {
      didFire.current = true;
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      nav.navigate('Next');
    }, HOLD_MS);
  };

  const cancelHold = () => {
    if (timer.current) clearTimeout(timer.current);
    if (!didFire.current) {
      Haptics.selectionAsync();
      Animated.timing(circleScale, { toValue: 0, duration: 350, useNativeDriver: true }).start(() =>
        setPressed(false)
      );
    } else {
      setPressed(false);
    }
  };

  const TOP_OFFSET = 200;

  return (
    <Animated.View style={{ flex: 1, backgroundColor: '#FFFFFF', opacity: screenOpacity }}>
      {/* Header copy (absolute; you can tweak TOP_OFFSET) */}
      <View
        style={{ position: 'absolute', top: TOP_OFFSET, left: 0, right: 0, alignItems: 'center' }}>
        <Animated.Text {...a} style={{ color: '#000000', fontSize: 24, fontWeight: '300' }}>
          are you ready to
        </Animated.Text>
        <Animated.Text
          {...b}
          style={{ color: '#000000', fontSize: 60, fontWeight: '700', marginTop: 2 }}>
          breakfree?
        </Animated.Text>
        <Animated.Text
          {...b}
          style={{ color: '#000000', fontSize: 16, fontWeight: '300', marginTop: 2 }}>
          (hold yes to get started)
        </Animated.Text>
      </View>

      {/* Dead-center hold target */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: 1000,
            height: 1000,
            borderRadius: 9999,
            backgroundColor: 'black',
            transform: [{ scale: circleScale }],
          }}
        />
        <Pressable onPressIn={startHold} onPressOut={cancelHold}>
          <Animated.Text
            {...c}
            style={{ color: pressed ? '#FFFFFF' : '#000000', fontSize: 20, fontWeight: '300' }}>
            yes
          </Animated.Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

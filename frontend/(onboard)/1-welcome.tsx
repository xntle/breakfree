// Welcome.tsx

import { Text, View, Animated, Easing, Pressable } from 'react-native';
import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

function useFloatFadeUp(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();
  }, [delay, opacity, translateY, bob]);

  const floatY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -4] });
  return { style: { opacity, transform: [{ translateY }, { translateY: floatY }] } };
}

export default function Welcome() {
  const nav = useNavigation<any>();
  const a = useFloatFadeUp(0);
  const b = useFloatFadeUp(120);
  const c = useFloatFadeUp(240);

  // Hold-to-navigate animation
  const HOLD_MS = 2000;
  const circleScale = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const didFire = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHold = () => {
    didFire.current = false;
    Animated.parallel([
      Animated.timing(circleScale, {
        toValue: 1,
        duration: HOLD_MS,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(circleOpacity, { toValue: 0.5, duration: 500, useNativeDriver: true }),
    ]).start();
    timer.current = setTimeout(() => {
      didFire.current = true;
      nav.navigate('Next');
    }, HOLD_MS);
  };

  const cancelHold = () => {
    if (timer.current) clearTimeout(timer.current);
    if (!didFire.current) {
      Animated.parallel([
        Animated.timing(circleScale, { toValue: 0, duration: 900, useNativeDriver: true }),
        Animated.timing(circleOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  };

  return (
    <View className="bg-ink-900 flex-1 items-center justify-center gap-y-6">
      <Animated.Text {...a} className="text-ink-300 text-xl font-thin">
        are you ready to
      </Animated.Text>

      <Animated.Text {...b} className="text-ink-100 text-5xl font-semibold">
        breakfree?
      </Animated.Text>

      {/* Hold area */}
      <View className="relative mt-10 items-center justify-center">
        {/* expanding black circle behind the word */}
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
        <Pressable onPressIn={startHold} onPressOut={cancelHold} delayLongPress={HOLD_MS}>
          <Animated.Text {...c} className="text-ink-300 text-xl font-thin">
            yes
          </Animated.Text>
        </Pressable>
      </View>
    </View>
  );
}

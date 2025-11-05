// src/screens/Next.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as AppleAuthentication from 'expo-apple-authentication';
import { StatusBar } from 'expo-status-bar';

export default function Next() {
  const titleY = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsY = useRef(new Animated.Value(16)).current;
  const [appleAvail, setAppleAvail] = useState(false);

  useEffect(() => {
    AppleAuthentication.isAvailableAsync()
      .then(setAppleAvail)
      .catch(() => setAppleAvail(false));
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(titleY, {
        toValue: -160,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(buttonsOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(buttonsY, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();
  }, [titleY, buttonsOpacity, buttonsY]);

  const onApple = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
    } catch {}
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
      }}>
      <StatusBar style="light" />
      <Animated.Text
        style={{
          color: '#fff',
          fontSize: 60,
          fontWeight: '700',
          transform: [{ translateY: titleY }],
        }}>
        breakfree
      </Animated.Text>
      <Animated.Text
        style={{
          color: '#fff',
          fontSize: 16,
          fontWeight: '300',
          transform: [{ translateY: titleY }],
        }}>
        Clarity, not doomscroll.
      </Animated.Text>

      <Animated.View
        style={{
          position: 'absolute',
          bottom: '20%',
          width: '86%',
          opacity: buttonsOpacity,
          transform: [{ translateY: buttonsY }],
        }}>
        {appleAvail && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
            cornerRadius={14}
            style={{ width: '100%', height: 48, marginBottom: 8 }}
            onPress={onApple}
          />
        )}

        <Pressable onPress={() => {}} style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
            By signing in, you agree to our Terms and Conditions
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

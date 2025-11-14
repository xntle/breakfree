import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as AppleAuthentication from 'expo-apple-authentication';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { RootNav } from 'App';

export default function NextScreen() {
  const titleY = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsY = useRef(new Animated.Value(16)).current;
  const [appleAvail, setAppleAvail] = useState(false);
  const navigation = useNavigation<RootNav>();

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
    <View style={styles.container}>
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
          textAlign: 'center',
          marginHorizontal: 16,
          transform: [{ translateY: titleY }],
        }}>
        block the noise, keep the texts
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

        <Pressable
          onPress={() => {
            navigation.navigate('Intro');
          }}
          style={{ alignItems: 'center', marginTop: 12 }}>
          <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
            By signing in, you agree to our{' '}
            <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Terms and Conditions</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

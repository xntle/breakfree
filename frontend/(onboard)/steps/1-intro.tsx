// =============================================================
// src/features/onboarding/steps/Welcome.tsx
// =============================================================
import * as React from 'react';
import { View, Text } from 'react-native';
import { Screen, Button, styles } from '../ui';
import type { RootNav } from 'App';

export default function Intro({ navigation }: { navigation: RootNav }) {
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.appName}>breakfree</Text>
        <Text style={styles.subtitle}>Block distractions. Keep your people.</Text>
      </View>
      <Button label="Enter Your Cocoon" onPress={() => navigation.navigate('Access')} />
    </Screen>
  );
}

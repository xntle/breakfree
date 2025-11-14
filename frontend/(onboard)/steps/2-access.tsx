// =============================================================
// src/features/onboarding/steps/Access.tsx
// =============================================================
import * as React from 'react';
import { ScrollView, Text } from 'react-native';
import { Screen, Button, Bullet, styles } from '../ui';
import type { RootNav } from 'App';

export default function Access({ navigation }: { navigation: RootNav }) {
  return (
    <Screen
      title="Grant Screen Time Access"
      footer={<Button label="Allow Access" onPress={() => navigation.navigate('Distractions')} />}>
      <ScrollView contentContainerStyle={{ gap: 12 }}>
        <Text style={styles.paragraph}>
          Cocoon needs Screen Time permissions to manage distractions and help you stay focused.
        </Text>
        <Bullet text="Block distracting apps during focus sessions" />
        <Bullet text="Track your screen time and productivity" />
        <Bullet text="Keep messaging apps accessible" />
      </ScrollView>
    </Screen>
  );
}

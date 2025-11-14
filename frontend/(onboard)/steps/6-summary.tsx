// =============================================================
// src/features/onboarding/steps/Summary.tsx
// =============================================================
import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Screen, Button, styles } from '../ui';
import { useOnboard } from '../OnboardingContext';
import type { RootNav } from 'App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DISTRACTION_APPS, MESSAGING_APPS } from '../data';

const mapLabels = (ids: string[], source: { id: string; label: string }[]) => {
  const m = new Map(source.map((s) => [s.id, s.label] as const));
  return ids.map((id) => m.get(id) ?? id).join(', ');
};

export default function Summary({ navigation }: { navigation: RootNav }) {
  const { blockedApps, allowedMessaging, mode, emergencyBreaks } = useOnboard();

  const finish = async () => {
    await AsyncStorage.setItem('hasOnboarded', '1');
    navigation.navigate('Main');
  };

  return (
    <Screen
      title="You're All Set!"
      footer={<Button label="Start My First Session" onPress={finish} />}>
      <ScrollView contentContainerStyle={{ gap: 16 }}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>Messaging Apps (Always Accessible)</Text>
          <Text style={styles.summaryValue}>
            {mapLabels(allowedMessaging, MESSAGING_APPS) || 'None selected'}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>Blocked Apps</Text>
          <Text style={styles.summaryValue}>
            {mapLabels(blockedApps, DISTRACTION_APPS) || 'None selected'}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>Focus Mode</Text>
          <Text style={styles.summaryValue}>
            {mode === 'Monk'
              ? `Monk — ${emergencyBreaks} emergency break(s)`
              : 'Amateur — flexible with unlimited breaks'}
          </Text>
        </View>
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            Ready to enter your cocoon and block out the noise? Your messaging apps will stay
            accessible.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

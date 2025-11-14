// =============================================================
// src/features/onboarding/steps/Mode.tsx
// =============================================================
import * as React from 'react';
import { View } from 'react-native';
import { Screen, Button, Card } from '../ui';
import { useOnboard } from '../OnboardingContext';
import type { RootNav } from 'App';

export default function Mode({ navigation }: { navigation: RootNav }) {
  const { mode, setMode, emergencyBreaks, setEmergencyBreaks } = useOnboard();
  return (
    <Screen
      title="Choose Your Mode"
      footer={<Button label="Continue" onPress={() => navigation.navigate('Summary')} />}>
      <View style={{ gap: 12 }}>
        <Card
          selected={mode === 'Monk'}
          onPress={() => setMode('Monk')}
          title="Monk Mode"
          subtitle="Maximum focus. All distracting apps blocked with one emergency break per session. For serious deep work.">
          {mode === 'Monk' && (
            <View
              style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}></View>
          )}
        </Card>
        <Card
          selected={mode === 'Amateur'}
          onPress={() => setMode('Amateur')}
          title="Amateur Mode"
          subtitle="Flexible focus. Unlimited breaks allowed, but tracked to build the habit of focused work."
        />
      </View>
    </Screen>
  );
}

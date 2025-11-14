// =============================================================
// src/features/onboarding/steps/Distractions.tsx
// =============================================================
import * as React from 'react';
import { FlatList } from 'react-native';
import { Screen, Button, Chip } from '../ui';
import { useOnboard } from '../OnboardingContext';
import { DISTRACTION_APPS } from '../data';
import type { RootNav } from 'App';

export default function Distractions({ navigation }: { navigation: RootNav }) {
  const { blockedApps, setBlockedApps } = useOnboard();
  const toggle = (id: string) =>
    setBlockedApps(
      blockedApps.includes(id) ? blockedApps.filter((x) => x !== id) : [...blockedApps, id]
    );

  return (
    <Screen
      title="What distracts you most?"
      footer={
        <Button
          label={`Continue (${blockedApps.length} selected)`}
          onPress={() => navigation.navigate('Messaging')}
        />
      }>
      <FlatList
        data={DISTRACTION_APPS}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Chip
            label={item.label}
            emoji={item.emoji}
            selected={blockedApps.includes(item.id)}
            onPress={() => toggle(item.id)}
          />
        )}
      />
    </Screen>
  );
}

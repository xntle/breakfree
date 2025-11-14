// =============================================================
// src/features/onboarding/steps/Messaging.tsx
// =============================================================
import * as React from 'react';
import { FlatList } from 'react-native';
import { Screen, Button, Chip } from '../ui';
import { useOnboard } from '../OnboardingContext';
import { MESSAGING_APPS } from '../data';
import type { RootNav } from 'App';

export default function Messaging({ navigation }: { navigation: RootNav }) {
  const { allowedMessaging, setAllowedMessaging } = useOnboard();
  const toggle = (id: string) =>
    setAllowedMessaging(
      allowedMessaging.includes(id)
        ? allowedMessaging.filter((x) => x !== id)
        : [...allowedMessaging, id]
    );

  return (
    <Screen
      title="Stay reachable via these apps"
      footer={
        <Button
          label={`Continue (${allowedMessaging.length} selected)`}
          onPress={() => navigation.navigate('Mode')}
        />
      }>
      <FlatList
        data={MESSAGING_APPS}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Chip
            label={item.label}
            emoji={item.emoji}
            selected={allowedMessaging.includes(item.id)}
            onPress={() => toggle(item.id)}
          />
        )}
      />
    </Screen>
  );
}

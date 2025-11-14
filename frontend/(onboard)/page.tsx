// App.tsx — Cocoon-style onboarding flow using React Navigation (stack)
// Drop this into a fresh Expo app and it should run as-is.
// Minimal deps: react, react-native, @react-navigation/native, @react-navigation/native-stack
// (Optional but recommended): react-native-safe-area-context

import 'react-native-gesture-handler';
import * as React from 'react';
import { useMemo, useState, createContext, useContext } from 'react';
import {
  Text,
  View,
  Pressable,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

/*************************
 * Types & Navigation
 *************************/
export type RootStackParamList = {
  Welcome: undefined;
  Access: undefined; // screen time permissions explainer
  Distractions: undefined; // pick apps to block
  Messaging: undefined; // pick messaging apps to allow
  Mode: undefined; // choose focus mode
  Summary: undefined; // review and start
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export type RootNav = NativeStackNavigationProp<RootStackParamList>;

/*************************
 * Onboarding State (Context)
 *************************/
interface OnboardState {
  blockedApps: string[]; // ids
  allowedMessaging: string[]; // ids
  mode: 'Monk' | 'Amateur';
  emergencyBreaks: number; // only for Monk
  setBlockedApps: (v: string[]) => void;
  setAllowedMessaging: (v: string[]) => void;
  setMode: (m: 'Monk' | 'Amateur') => void;
  setEmergencyBreaks: (n: number) => void;
}

const OnboardCtx = createContext<OnboardState | null>(null);

function useOnboard() {
  const ctx = useContext(OnboardCtx);
  if (!ctx) throw new Error('OnboardCtx missing');
  return ctx;
}

function OnboardProvider({ children }: { children: React.ReactNode }) {
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [allowedMessaging, setAllowedMessaging] = useState<string[]>([]);
  const [mode, setMode] = useState<'Monk' | 'Amateur'>('Amateur');
  const [emergencyBreaks, setEmergencyBreaks] = useState<number>(1);

  const value = useMemo(
    () => ({
      blockedApps,
      allowedMessaging,
      mode,
      emergencyBreaks,
      setBlockedApps,
      setAllowedMessaging,
      setMode,
      setEmergencyBreaks,
    }),
    [blockedApps, allowedMessaging, mode, emergencyBreaks]
  );

  return <OnboardCtx.Provider value={value}>{children}</OnboardCtx.Provider>;
}

/*************************
 * Mock Data
 *************************/
const DISTRACTION_APPS = [
  { id: 'instagram', label: 'Instagram', emoji: '📸' },
  { id: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { id: 'twitter', label: 'X (Twitter)', emoji: '🐦' },
  { id: 'facebook', label: 'Facebook', emoji: '👥' },
  { id: 'youtube', label: 'YouTube', emoji: '▶️' },
  { id: 'reddit', label: 'Reddit', emoji: '🤖' },
  { id: 'news', label: 'News', emoji: '📰' },
  { id: 'games', label: 'Games', emoji: '🎮' },
];

const MESSAGING_APPS = [
  { id: 'imessage', label: 'iMessage', emoji: '💬' },
  { id: 'whatsapp', label: 'WhatsApp', emoji: '💬' },
  { id: 'telegram', label: 'Telegram', emoji: '✈️' },
  { id: 'messenger', label: 'Messenger', emoji: '💬' },
  { id: 'signal', label: 'Signal', emoji: '🔐' },
  { id: 'slack', label: 'Slack', emoji: '💼' },
  { id: 'discord', label: 'Discord', emoji: '🕹️' },
  { id: 'wechat', label: 'WeChat', emoji: '🟢' },
];

/*************************
 * Small UI Helpers
 *************************/
function Screen({
  title,
  children,
  footer,
}: {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <View style={{ flex: 1 }}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </SafeAreaView>
  );
}

function Button({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[styles.button, disabled && styles.buttonDisabled]}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

function Chip({
  label,
  selected,
  onPress,
  emoji,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  emoji?: string;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={styles.chipText}>
        {emoji ? `${emoji} ` : ''}
        {label}
      </Text>
    </Pressable>
  );
}

/*************************
 * Screens
 *************************/
function WelcomeScreen({ navigation }: { navigation: RootNav }) {
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.appName}>Cocoon</Text>
        <Text style={styles.subtitle}>Block distractions. Keep your people.</Text>
      </View>
      <Button label="Enter Your Cocoon" onPress={() => navigation.navigate('Access')} />
    </Screen>
  );
}

function AccessScreen({ navigation }: { navigation: RootNav }) {
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

function Bullet({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
      <Text>•</Text>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

function DistractionsScreen({ navigation }: { navigation: RootNav }) {
  const { blockedApps, setBlockedApps } = useOnboard();

  const toggle = (id: string) => {
    setBlockedApps(
      blockedApps.includes(id) ? blockedApps.filter((x) => x !== id) : [...blockedApps, id]
    );
  };

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

function MessagingScreen({ navigation }: { navigation: RootNav }) {
  const { allowedMessaging, setAllowedMessaging } = useOnboard();

  const toggle = (id: string) => {
    setAllowedMessaging(
      allowedMessaging.includes(id)
        ? allowedMessaging.filter((x) => x !== id)
        : [...allowedMessaging, id]
    );
  };

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

function ModeScreen({ navigation }: { navigation: RootNav }) {
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
            <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.paragraph}>Emergency breaks:</Text>
              <Counter value={emergencyBreaks} onChange={setEmergencyBreaks} min={0} max={3} />
            </View>
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

function Card({
  title,
  subtitle,
  selected,
  onPress,
  children,
}: {
  title: string;
  subtitle?: string;
  selected?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.cardSelected]}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      {children}
    </Pressable>
  );
}

function Counter({
  value,
  onChange,
  min = 0,
  max = 10,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Pressable onPress={() => onChange(Math.max(min, value - 1))} style={styles.counterBtn}>
        <Text style={styles.counterText}>-</Text>
      </Pressable>
      <Text style={styles.counterValue}>{value}</Text>
      <Pressable onPress={() => onChange(Math.min(max, value + 1))} style={styles.counterBtn}>
        <Text style={styles.counterText}>+</Text>
      </Pressable>
    </View>
  );
}

function SummaryScreen({ navigation }: { navigation: RootNav }) {
  const { blockedApps, allowedMessaging, mode, emergencyBreaks } = useOnboard();

  return (
    <Screen
      title="You're All Set!"
      footer={
        <Button label="Start My First Session" onPress={() => navigation.navigate('Welcome')} />
      }>
      <ScrollView contentContainerStyle={{ gap: 16 }}>
        <SummaryItem
          title="Messaging Apps (Always Accessible)"
          value={renderList(allowedMessaging, MESSAGING_APPS)}
        />
        <SummaryItem title="Blocked Apps" value={renderList(blockedApps, DISTRACTION_APPS)} />
        <SummaryItem
          title="Focus Mode"
          value={
            mode === 'Monk'
              ? `Monk — ${emergencyBreaks} emergency break(s)`
              : 'Amateur — flexible with unlimited breaks'
          }
        />
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

function SummaryItem({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={styles.summaryValue}>{value || 'None selected'}</Text>
    </View>
  );
}

function renderList(ids: string[], source: { id: string; label: string }[]) {
  const map = new Map(source.map((s) => [s.id, s.label] as const));
  return ids.map((id) => map.get(id) ?? id).join(', ');
}

/*************************
 * Root App
 *************************/
export default function App() {
  return (
    <OnboardProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' } }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Access" component={AccessScreen} />
          <Stack.Screen name="Distractions" component={DistractionsScreen} />
          <Stack.Screen name="Messaging" component={MessagingScreen} />
          <Stack.Screen name="Mode" component={ModeScreen} />
          <Stack.Screen name="Summary" component={SummaryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </OnboardProvider>
  );
}

/*************************
 * Styles
 *************************/
const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  appName: { fontSize: 32, fontWeight: '800' },
  subtitle: { marginTop: 8, fontSize: 16, color: '#555', textAlign: 'center' },
  paragraph: { fontSize: 16, color: '#333', lineHeight: 22 },
  footer: { paddingVertical: 8 },

  button: { backgroundColor: '#111', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },

  chip: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { color: '#111' },

  card: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 16, padding: 16 },
  cardSelected: { borderColor: '#111', backgroundColor: '#fafafa' },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  cardSubtitle: { fontSize: 14, color: '#555' },

  counterBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  counterText: { fontSize: 18, fontWeight: '700' },
  counterValue: { fontSize: 16, fontWeight: '700' },

  summaryItem: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12 },
  summaryTitle: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 16, fontWeight: '600', marginTop: 4 },

  noteBox: { backgroundColor: '#f6f6f6', borderRadius: 12, padding: 12 },
  noteText: { color: '#444' },
});

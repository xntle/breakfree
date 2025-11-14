import * as React from 'react';
import { Text, View, Pressable, StyleSheet, SafeAreaView } from 'react-native';

export function Screen({
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

export function Button({
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

export function Bullet({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
      <Text>•</Text>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

export function Chip({
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
      <Text style={[styles.chipText, selected && { color: 'white' }]}>
        {emoji ? `${emoji} ` : ''}
        {label}
      </Text>
    </Pressable>
  );
}

export function Card({
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

export const styles = StyleSheet.create({
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

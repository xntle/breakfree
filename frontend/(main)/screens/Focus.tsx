import * as React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboard } from '(onboard)/OnboardingContext';

type TimerPreset = {
  name: string;
  duration: number; // in minutes
  type: 'Pomodoro' | 'Deep Work' | 'Custom';
};

const PRESETS: TimerPreset[] = [
  { name: 'Pomodoro', duration: 25, type: 'Pomodoro' },
  { name: 'Short Break', duration: 5, type: 'Pomodoro' },
  { name: 'Deep Work', duration: 90, type: 'Deep Work' },
  { name: 'Long Break', duration: 15, type: 'Pomodoro' },
];

export default function Focus() {
  const { mode, emergencyBreaks } = useOnboard();
  const [selectedPreset, setSelectedPreset] = React.useState<TimerPreset | null>(null);
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(0);

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Focus</Text>
          <Text style={styles.subtitle}>Session management</Text>
        </View>

        {/* Active Session */}
        {isRunning && selectedPreset ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Active Session</Text>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            <Text style={styles.presetName}>{selectedPreset.name}</Text>
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setIsRunning(false)}>
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Pause</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonDanger]}
                onPress={() => {
                  setIsRunning(false);
                  setSelectedPreset(null);
                  setTimeRemaining(0);
                }}>
                <Text style={[styles.buttonText, styles.buttonTextDanger]}>Stop</Text>
              </Pressable>
            </View>
            {mode === 'Monk' && (
              <Text style={styles.emergencyText}>
                Emergency breaks remaining: {emergencyBreaks}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No active session</Text>
            <Text style={styles.cardSubtext}>Select a preset below to start</Text>
          </View>
        )}

        {/* Timer Presets */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Timer Presets</Text>
          {PRESETS.map((preset) => (
            <Pressable
              key={preset.name}
              style={[
                styles.presetItem,
                selectedPreset?.name === preset.name && styles.presetItemSelected,
              ]}
              onPress={() => {
                setSelectedPreset(preset);
                setTimeRemaining(preset.duration);
              }}>
              <View style={styles.presetContent}>
                <Text style={styles.presetName}>{preset.name}</Text>
                <Text style={styles.presetDuration}>{formatTime(preset.duration)}</Text>
              </View>
              <Text style={styles.presetType}>{preset.type}</Text>
            </Pressable>
          ))}
          {selectedPreset && !isRunning && (
            <Pressable style={styles.startButton} onPress={() => setIsRunning(true)}>
              <Text style={styles.startButtonText}>Start {selectedPreset.name}</Text>
            </Pressable>
          )}
        </View>

        {/* Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Schedule</Text>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleTime}>9:00 AM</Text>
            <Text style={styles.scheduleName}>Deep Work Session</Text>
          </View>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleTime}>2:00 PM</Text>
            <Text style={styles.scheduleName}>Pomodoro Block</Text>
          </View>
          <Pressable style={styles.linkButton}>
            <Text style={styles.linkText}>View Full Schedule →</Text>
          </Pressable>
        </View>

        {/* Preset Configurations */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preset Configurations</Text>
          <Pressable style={styles.configItem}>
            <Text style={styles.configLabel}>Pomodoro Settings</Text>
            <Text style={styles.configValue}>25m work, 5m break</Text>
          </Pressable>
          <Pressable style={styles.configItem}>
            <Text style={styles.configLabel}>Deep Work Settings</Text>
            <Text style={styles.configValue}>90m sessions</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    maxWidth: 448,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'OpenSans-ExtraBold',
    color: '#ede9e9',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    marginBottom: 12,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#999',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    fontFamily: 'OpenSans-ExtraBold',
    color: '#ede9e9',
    textAlign: 'center',
    marginVertical: 16,
  },
  presetName: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#ede9e9',
  },
  buttonSecondary: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#ede9e9',
  },
  buttonDanger: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#ede9e9',
  },
  buttonText: {
    color: '#050505',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
  },
  buttonTextSecondary: {
    color: '#ede9e9',
  },
  buttonTextDanger: {
    color: '#ede9e9',
  },
  emergencyText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
  presetItem: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  presetItemSelected: {
    borderColor: '#ede9e9',
    backgroundColor: '#2a2a2a',
  },
  presetContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  presetDuration: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
  },
  presetType: {
    fontSize: 12,
    color: '#999',
  },
  startButton: {
    backgroundColor: '#ede9e9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: {
    color: '#050505',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
  },
  scheduleItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    width: 80,
  },
  scheduleName: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  linkButton: {
    marginTop: 12,
  },
  linkText: {
    fontSize: 14,
    color: '#ede9e9',
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  configLabel: {
    fontSize: 14,
    color: '#ede9e9',
    fontWeight: '500',
    fontFamily: 'OpenSans-Medium',
  },
  configValue: {
    fontSize: 14,
    color: '#999',
  },
});

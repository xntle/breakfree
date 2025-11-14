import * as React from 'react';
export type FocusMode = 'Monk' | 'Amateur';

interface OnboardState {
  blockedApps: string[];
  allowedMessaging: string[];
  mode: FocusMode;
  emergencyBreaks: number;
  setBlockedApps: (v: string[]) => void;
  setAllowedMessaging: (v: string[]) => void;
  setMode: (m: FocusMode) => void;
  setEmergencyBreaks: (n: number) => void;
}

const OnboardCtx = React.createContext<OnboardState | null>(null);
export const useOnboard = () => {
  const v = React.useContext(OnboardCtx);
  if (!v) throw new Error('useOnboard used outside provider');
  return v;
};

export function OnboardProvider({ children }: { children: React.ReactNode }) {
  const [blockedApps, setBlockedApps] = React.useState<string[]>([]);
  const [allowedMessaging, setAllowedMessaging] = React.useState<string[]>([]);
  const [mode, setMode] = React.useState<FocusMode>('Amateur');
  const [emergencyBreaks, setEmergencyBreaks] = React.useState(1);

  const value = React.useMemo(
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

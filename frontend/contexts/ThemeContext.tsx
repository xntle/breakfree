import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'dark' | 'light';

export interface Theme {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderLight: string;
    primary: string;
    primaryLight: string;
    accent: string;
    // Blur backgrounds
    blurBackground: string;
    blurSurface: string;
    blurBorder: string;
  };
}

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#050505',
    surface: '#2a2a2a',
    surfaceSecondary: '#333',
    text: '#ede9e9',
    textSecondary: '#999',
    textTertiary: '#666',
    border: '#333',
    borderLight: 'rgba(255, 255, 255, 0.1)',
    primary: '#ede9e9',
    primaryLight: 'rgba(237, 233, 233, 0.8)',
    accent: '#ede9e9',
    // Blur backgrounds
    blurBackground: 'rgba(5, 5, 5, 0.5)',
    blurSurface: 'rgba(42, 42, 42, 0.5)',
    blurBorder: 'rgba(255, 255, 255, 0.1)',
  },
};

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#f5f5f5',
    surface: '#ffffff',
    surfaceSecondary: '#f0f0f0',
    text: '#050505',
    textSecondary: '#666',
    textTertiary: '#999',
    border: '#e0e0e0',
    borderLight: 'rgba(0, 0, 0, 0.1)',
    primary: '#050505',
    primaryLight: 'rgba(32, 31, 31, 0.8)',
    accent: '#050505',
    // Blur backgrounds
    blurBackground: 'rgba(245, 245, 245, 0.7)',
    blurSurface: 'rgba(255, 255, 255, 0.8)',
    blurBorder: 'rgba(0, 0, 0, 0.1)',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = React.useState<ThemeMode>('dark');
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setReady(true);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = React.useCallback(async () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
    try {
      await AsyncStorage.setItem('themeMode', newMode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [themeMode]);

  const setTheme = React.useCallback(async (mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  if (!ready) {
    return null; // or a loading screen
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// import 'react-native-gesture-handler';
// import { createStaticNavigation } from '@react-navigation/native';
// import {
//   createNativeStackNavigator,
//   NativeStackNavigationProp,
// } from '@react-navigation/native-stack';

// export type RootStackParamList = {
//   Welcome: undefined;
//   Next: undefined;
//   Terms: undefined;
// };

// export type RootNav = NativeStackNavigationProp<RootStackParamList>;

// const RootStack = createNativeStackNavigator<RootStackParamList>({
//   screens: {
//     Welcome: { screen: Welcome, options: { headerShown: false } },
//     Next: { screen: Next, options: { headerShown: false, animation: 'fade' } },
//     Terms: { screen: Terms, options: { headerShown: false } },
//   },
//   initialRouteName: 'Welcome',
// });

// const Navigation = createStaticNavigation(RootStack);

// export default function App() {
//   return <Navigation />;
// }

import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import {
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  OpenSans_800ExtraBold,
} from '@expo-google-fonts/open-sans';

import { OnboardProvider } from '(onboard)/OnboardingContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Welcome from '(start)/1-welcome';
import Intro from '(onboard)/steps/1-intro';
import Access from '(onboard)/steps/2-access';
import Distractions from '(onboard)/steps/3-distractions';
import Messaging from '(onboard)/steps/4-messaging';
import Mode from '(onboard)/steps/5-mode';
import Summary from '(onboard)/steps/6-summary';
import Next from '(start)/2-next';
import MainTabs from '(main)/Tabs';
import Me from '(main)/screens/Me';

export type RootStackParamList = {
  Next: undefined;
  // Onboarding group
  Welcome: undefined;
  Intro: undefined;
  Access: undefined;
  Distractions: undefined;
  Messaging: undefined;
  Mode: undefined;
  Summary: undefined;
  // Main app
  Main: undefined;
  Me: undefined;
};

export type RootNav = NativeStackNavigationProp<RootStackParamList>;
const Stack = createNativeStackNavigator<RootStackParamList>();

function useOnboardFlag() {
  const [ready, setReady] = React.useState(false);
  const [done, setDone] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkOnboarded = async () => {
      const v = await AsyncStorage.getItem('hasOnboarded');
      setDone(v === '1');
      setReady(true);
    };

    checkOnboarded();

    // Listen for storage changes (for when user completes onboarding)
    const interval = setInterval(checkOnboarded, 200);
    return () => clearInterval(interval);
  }, []);

  return { ready, done } as const;
}

export default function App() {
  const { ready, done } = useOnboardFlag();
  const [fontsLoaded] = useFonts({
    'OpenSans-Light': OpenSans_300Light,
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-Medium': OpenSans_500Medium,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'OpenSans-ExtraBold': OpenSans_800ExtraBold,
  });

  if (!ready || !fontsLoaded) return null; // splash could go here

  return (
    <ThemeProvider>
      <OnboardProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' } }}
            initialRouteName={done ? 'Main' : 'Welcome'}>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Me" component={Me} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Intro" component={Intro} />
            <Stack.Screen name="Next" component={Next} />
            <Stack.Screen name="Access" component={Access} />
            <Stack.Screen name="Distractions" component={Distractions} />
            <Stack.Screen name="Messaging" component={Messaging} />
            <Stack.Screen name="Mode" component={Mode} />
            <Stack.Screen name="Summary" component={Summary} />
          </Stack.Navigator>
        </NavigationContainer>
      </OnboardProvider>
    </ThemeProvider>
  );
}

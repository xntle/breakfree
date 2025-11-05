// App.tsx (known-good)
import 'react-native-gesture-handler';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from '(onboard)/1-welcome';
import Next from '(onboard)/2-next';

export type RootStackParamList = { Welcome: undefined; Next: undefined };
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Next" component={Next} options={{ animation: 'fade' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

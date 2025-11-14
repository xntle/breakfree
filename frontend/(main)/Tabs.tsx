import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { Home, MessageCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

import HomeScreen from './screens/Home';
import MessagesStack from './screens/messages/MessagesStack';

export type MainTabParamList = {
  Home: undefined;
  Messages: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabBarBackground() {
  return <View style={[styles.gradientContainer, { backgroundColor: '#000000' }]} />;
}

export default function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <TabBarBackground />,
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ opacity: focused ? 0.8 : 0.4 }}>
              <Home size={20} color={color} fill={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ opacity: focused ? 0.8 : 0.4 }}>
              <MessageCircle size={20} color={color} fill={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent',
    height: 68,
    paddingBottom: 16,
    paddingTop: 0,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  gradientContainer: {
    flex: 1,
    width: '100%',
    height: 68,
    overflow: 'hidden',
  },
});

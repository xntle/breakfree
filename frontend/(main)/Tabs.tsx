import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, MessageCircle } from 'lucide-react-native';

import HomeScreen from './screens/Home';
import MessagesStack from './screens/messages/MessagesStack';

export type MainTabParamList = {
  Home: undefined;
  Messages: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function GradientBackground() {
  return (
    <View style={styles.gradientContainer}>
      <LinearGradient
        colors={[
          'rgba(32, 31, 31, 0)',
          'rgba(32, 31, 31, 0.3)',
          'rgba(32, 31, 31, 0.7)',
          '#201f1f',
        ]}
        locations={[0, 0.3, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <GradientBackground />,
        tabBarActiveTintColor: '#ede9e9',
        tabBarInactiveTintColor: '#666',
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
    backgroundColor: '#201f1f',
    overflow: 'hidden',
  },
});

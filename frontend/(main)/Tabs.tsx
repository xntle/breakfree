import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { Home, Target, MessageCircle, BarChart3, User } from 'lucide-react-native';

import HomeScreen from './screens/Home';
import Focus from './screens/Focus';
import Messages from './screens/Messages';
import Insights from './screens/Insights';
import Me from './screens/Me';

export type MainTabParamList = {
  Home: undefined;
  Focus: undefined;
  Messages: undefined;
  Insights: undefined;
  Me: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function GradientBackground() {
  return (
    <View style={styles.gradientContainer}>
      <View style={styles.gradientBottom} />
      <View style={styles.gradientMid} />
      <View style={styles.gradientTop} />
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
              <Home
                size={20}
                color={color}
                fill={focused ? color : 'transparent'}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Focus"
        component={Focus}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ opacity: focused ? 0.8 : 0.4 }}>
              <Target
                size={20}
                color={color}
                fill={focused ? color : 'transparent'}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ opacity: focused ? 0.8 : 0.4 }}>
              <MessageCircle
                size={20}
                color={color}
                fill={focused ? color : 'transparent'}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Insights"
        component={Insights}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ opacity: focused ? 0.8 : 0.4 }}>
              <BarChart3
                size={20}
                color={color}
                fill={focused ? color : 'transparent'}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Me"
        component={Me}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ opacity: focused ? 0.8 : 0.4 }}>
              <User
                size={20}
                color={color}
                fill={focused ? color : 'transparent'}
                strokeWidth={focused ? 2.5 : 2}
              />
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
    position: 'relative',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 68,
    backgroundColor: 'rgba(32, 31, 31, 0.95)',
  },
  gradientMid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
    backgroundColor: 'rgba(32, 31, 31, 0.7)',
  },
  gradientTop: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 22,
    backgroundColor: 'rgba(32, 31, 31, 0.4)',
  },
});

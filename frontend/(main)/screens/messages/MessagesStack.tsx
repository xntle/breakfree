import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessagesList from './page';
import MessageDetail from './[slug]/[slug]';

export type MessagesStackParamList = {
  MessagesList: undefined;
  MessageDetail: { slug: string };
};

const Stack = createNativeStackNavigator<MessagesStackParamList>();

export default function MessagesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#201f1f' },
      }}>
      <Stack.Screen name="MessagesList" component={MessagesList} />
      <Stack.Screen name="MessageDetail" component={MessageDetail} />
    </Stack.Navigator>
  );
}

import * as React from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MessagesStackParamList } from '../MessagesStack';

type ChatMessage = {
  id: string;
  text: string;
  time: string;
  isSent: boolean;
};

type Conversation = {
  id: string;
  name: string;
  platform: string;
  lastMessage: string;
  time: string;
  unread: number;
};

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Sarah',
    platform: 'iMessage',
    lastMessage: 'Hey, are we still on for lunch?',
    time: '10:30 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Mike',
    platform: 'WhatsApp',
    lastMessage: 'Thanks for the help yesterday!',
    time: '9:15 AM',
    unread: 0,
  },
  {
    id: '3',
    name: 'Team Chat',
    platform: 'Telegram',
    lastMessage: 'New project update available',
    time: '8:45 AM',
    unread: 5,
  },
  {
    id: '4',
    name: 'Mom',
    platform: 'iMessage',
    lastMessage: 'Call me when you get a chance',
    time: 'Yesterday',
    unread: 1,
  },
];

type RouteParams = {
  slug: string;
};

export default function MessageDetail() {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<MessagesStackParamList>>();
  const { slug } = (route.params as RouteParams) || { slug: '' };

  const conversation = React.useMemo(
    () => MOCK_CONVERSATIONS.find((conv) => conv.id === slug),
    [slug]
  );

  const conversationName = conversation?.name || slug;
  const conversationPlatform = conversation?.platform || 'iMessage';
  const [messageText, setMessageText] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hey! How are you?',
      time: '10:15 AM',
      isSent: false,
    },
    {
      id: '2',
      text: "I'm doing great, thanks for asking!",
      time: '10:16 AM',
      isSent: true,
    },
    {
      id: '3',
      text: 'Thats awesome to hear!',
      time: '10:17 AM',
      isSent: false,
    },
  ]);

  const sendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <View style={styles.chatHeaderInfo}>
          <Text style={styles.chatHeaderName}>{conversationName}</Text>
          <Text style={styles.chatHeaderPlatform}>{conversationPlatform}</Text>
        </View>
      </View>

      {/* Messages Container */}
      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.isSent ? styles.messageRowSent : styles.messageRowReceived,
            ]}>
            <View
              style={[
                styles.messageBubble,
                message.isSent ? styles.messageBubbleSent : styles.messageBubbleReceived,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  message.isSent ? styles.messageTextSent : styles.messageTextReceived,
                ]}>
                {message.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  message.isSent ? styles.messageTimeSent : styles.messageTimeReceived,
                ]}>
                {message.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          placeholderTextColor="#999"
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={1000}
        />
        <Pressable
          style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!messageText.trim()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#201f1f',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#201f1f',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#ede9e9',
    fontWeight: '600',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
  },
  chatHeaderPlatform: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#201f1f',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  messageRowSent: {
    justifyContent: 'flex-end',
  },
  messageRowReceived: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  messageBubbleSent: {
    backgroundColor: '#ede9e9',
    borderBottomRightRadius: 4,
  },
  messageBubbleReceived: {
    backgroundColor: '#2a2a2a',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTextSent: {
    color: '#201f1f',
  },
  messageTextReceived: {
    color: '#ede9e9',
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'flex-end',
  },
  messageTimeSent: {
    color: 'rgba(32, 31, 31, 0.7)',
  },
  messageTimeReceived: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#201f1f',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#ede9e9',
    maxHeight: 100,
    backgroundColor: '#2a2a2a',
  },
  sendButton: {
    backgroundColor: '#ede9e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#201f1f',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
  },
});

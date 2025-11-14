import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Send, MessageCircle, MessageSquare, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../../../contexts/ThemeContext';
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
  const { theme } = useTheme();
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<MessagesStackParamList>>();
  const { slug } = (route.params as RouteParams) || { slug: '' };
  const scrollViewRef = React.useRef<ScrollView>(null);

  const conversation = React.useMemo(
    () => MOCK_CONVERSATIONS.find((conv) => conv.id === slug),
    [slug]
  );

  const conversationName = conversation?.name || slug;
  const conversationPlatform = conversation?.platform || 'iMessage';

  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('imessage') || platformLower.includes('message')) {
      return <MessageCircle size={20} color={theme.colors.text} strokeWidth={2.5} />;
    }
    if (platformLower.includes('whatsapp')) {
      return <MessageSquare size={20} color={theme.colors.text} strokeWidth={2.5} />;
    }
    if (platformLower.includes('telegram')) {
      return <MessageCircle size={20} color={theme.colors.text} strokeWidth={2.5} />;
    }
    return <MessageCircle size={20} color={theme.colors.text} strokeWidth={2.5} />;
  };

  // Generate dynamic styles based on theme
  const dynamicStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        keyboardAvoid: {
          flex: 1,
        },
        chatHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: theme.colors.background,
        },
        backButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
        },
        chatHeaderCenter: {
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          gap: 12,
        },
        avatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.surfaceSecondary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        avatarText: {
          fontSize: 18,
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
        },
        chatHeaderInfo: {
          alignItems: 'flex-start',
        },
        chatHeaderName: {
          fontSize: 16,
          fontWeight: '700',
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
        },
        chatHeaderPlatform: {
          fontSize: 12,
          fontFamily: 'OpenSans-Regular',
          color: theme.colors.textSecondary,
          marginTop: 2,
        },
        platformIconContainer: {
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        },
        messagesContainer: {
          flex: 1,
          backgroundColor: theme.colors.background,
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
          backgroundColor: theme.colors.text,
          borderBottomRightRadius: 4,
        },
        messageBubbleReceived: {
          backgroundColor: theme.colors.surface,
          borderBottomLeftRadius: 4,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        messageText: {
          fontSize: 16,
          fontFamily: 'OpenSans-Regular',
          lineHeight: 20,
          marginBottom: 4,
        },
        messageTextSent: {
          color: theme.colors.background,
        },
        messageTextReceived: {
          color: theme.colors.text,
        },
        messageTime: {
          fontSize: 11,
          fontFamily: 'OpenSans-Regular',
          alignSelf: 'flex-end',
        },
        messageTimeSent: {
          color: theme.colors.background,
          opacity: 0.7,
        },
        messageTimeReceived: {
          color: theme.colors.textSecondary,
        },
        inputContainer: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: theme.colors.background,
          gap: 12,
        },
        input: {
          flex: 1,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 10,
          fontSize: 16,
          fontFamily: 'OpenSans-Regular',
          color: theme.colors.text,
          maxHeight: 100,
          backgroundColor: theme.colors.surface,
        },
        sendButton: {
          backgroundColor: theme.colors.text,
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        },
        sendButtonDisabled: {
          backgroundColor: theme.colors.surfaceSecondary,
          opacity: 0.5,
        },
      }),
    [theme]
  );

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

    // Scroll to bottom after sending
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  React.useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={dynamicStyles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        {/* Chat Header */}
        <View style={dynamicStyles.chatHeader}>
          <Pressable onPress={() => navigation.goBack()} style={dynamicStyles.backButton}>
            <ArrowLeft size={20} color={theme.colors.text} strokeWidth={2.5} />
          </Pressable>
          <View style={dynamicStyles.chatHeaderCenter}>
            <View style={dynamicStyles.avatar}>
              <Text style={dynamicStyles.avatarText}>
                {conversationName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={dynamicStyles.chatHeaderInfo}>
              <Text style={dynamicStyles.chatHeaderName}>{conversationName}</Text>
              <Text style={dynamicStyles.chatHeaderPlatform}>{conversationPlatform}</Text>
            </View>
          </View>
          <View style={dynamicStyles.platformIconContainer}>
            {getPlatformIcon(conversationPlatform)}
          </View>
        </View>

        {/* Messages Container */}
        <ScrollView
          ref={scrollViewRef}
          style={dynamicStyles.messagesContainer}
          contentContainerStyle={dynamicStyles.messagesContent}
          keyboardShouldPersistTaps="handled">
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                dynamicStyles.messageRow,
                message.isSent ? dynamicStyles.messageRowSent : dynamicStyles.messageRowReceived,
              ]}>
              <View
                style={[
                  dynamicStyles.messageBubble,
                  message.isSent
                    ? dynamicStyles.messageBubbleSent
                    : dynamicStyles.messageBubbleReceived,
                ]}>
                <Text
                  style={[
                    dynamicStyles.messageText,
                    message.isSent
                      ? dynamicStyles.messageTextSent
                      : dynamicStyles.messageTextReceived,
                  ]}>
                  {message.text}
                </Text>
                <Text
                  style={[
                    dynamicStyles.messageTime,
                    message.isSent
                      ? dynamicStyles.messageTimeSent
                      : dynamicStyles.messageTimeReceived,
                  ]}>
                  {message.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={dynamicStyles.inputContainer}>
          <TextInput
            style={dynamicStyles.input}
            placeholder="Message"
            placeholderTextColor={theme.colors.textSecondary}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
          />
          <Pressable
            style={[
              dynamicStyles.sendButton,
              !messageText.trim() && dynamicStyles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!messageText.trim()}>
            <Send
              size={20}
              color={messageText.trim() ? theme.colors.background : theme.colors.textTertiary}
              strokeWidth={2.5}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

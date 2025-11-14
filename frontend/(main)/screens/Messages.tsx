import * as React from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Layers, Pencil, Search, MessageCircle, MessageSquare } from 'lucide-react-native';
import { useOnboard } from '(onboard)/OnboardingContext';

type Conversation = {
  id: string;
  name: string;
  platform: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
};

type ChatMessage = {
  id: string;
  text: string;
  time: string;
  isSent: boolean;
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

const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    text: 'Hey, are we still on for lunch?',
    time: '10:28 AM',
    isSent: false,
  },
  {
    id: '2',
    text: 'Yes! See you at 12:30',
    time: '10:29 AM',
    isSent: true,
  },
  {
    id: '3',
    text: 'Perfect, looking forward to it!',
    time: '10:30 AM',
    isSent: false,
  },
];

const getPlatformIcon = (platform: string) => {
  const platformLower = platform.toLowerCase();
  if (platformLower.includes('imessage') || platformLower.includes('message')) {
    return <MessageCircle size={12} color="#201f1f" strokeWidth={2.5} />;
  }
  if (platformLower.includes('whatsapp')) {
    return <MessageSquare size={12} color="#201f1f" strokeWidth={2.5} />;
  }
  if (platformLower.includes('telegram')) {
    return <MessageCircle size={12} color="#201f1f" strokeWidth={2.5} />;
  }
  return <MessageCircle size={12} color="#201f1f" strokeWidth={2.5} />;
};

export default function Messages() {
  const { allowedMessaging } = useOnboard();
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null);
  const [messageText, setMessageText] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showAddScreen, setShowAddScreen] = React.useState(false);
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  const filteredConversations = React.useMemo(() => {
    let filtered = MOCK_CONVERSATIONS;

    // Filter by unread status
    if (filter === 'unread') {
      filtered = filtered.filter((conv) => conv.unread > 0);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (conv) =>
          conv.name.toLowerCase().includes(query) ||
          conv.lastMessage.toLowerCase().includes(query) ||
          conv.platform.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, filter]);

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

  if (selectedConversation) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.chatHeader}>
          <Pressable onPress={() => setSelectedConversation(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderName}>{selectedConversation.name}</Text>
            <Text style={styles.chatHeaderPlatform}>{selectedConversation.platform}</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}>
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
            placeholderTextColor="#666"
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerIconButton}>
          <Layers size={24} color="#ede9e9" strokeWidth={2} />
        </Pressable>
        <Text style={styles.headerTitle}>All Chat</Text>
        <Pressable onPress={() => setShowAddScreen(true)} style={styles.headerIconButton}>
          <Pencil size={24} color="#ede9e9" strokeWidth={2} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search size={18} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}>
          <Text style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}>
            All
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, filter === 'unread' && styles.filterChipActive]}
          onPress={() => setFilter('unread')}>
          <Text style={[styles.filterChipText, filter === 'unread' && styles.filterChipTextActive]}>
            Unread
          </Text>
        </Pressable>
      </View>

      {/* Conversations List */}
      <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
        {filteredConversations.map((conversation) => (
          <Pressable
            key={conversation.id}
            style={styles.conversationItem}
            onPress={() => setSelectedConversation(conversation)}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{conversation.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.platformBadge}>{getPlatformIcon(conversation.platform)}</View>
            </View>

            {/* Content */}
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationName} numberOfLines={1}>
                  {conversation.name}
                </Text>
                <Text style={styles.conversationTime}>{conversation.time}</Text>
              </View>
              <View style={styles.conversationFooter}>
                <Text style={styles.conversationMessage} numberOfLines={1}>
                  {conversation.lastMessage}
                </Text>
                {conversation.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{conversation.unread}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.conversationPlatform}>{conversation.platform}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Add Screen Modal */}
      {showAddScreen && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New</Text>
              <Pressable onPress={() => setShowAddScreen(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            {/* Options */}
            <View style={styles.addOptions}>
              <Pressable
                style={styles.addOption}
                onPress={() => {
                  // TODO: Navigate to add new person screen
                  setShowAddScreen(false);
                }}>
                <View style={styles.addOptionIcon}>
                  <Text style={styles.addOptionIconText}>👤</Text>
                </View>
                <View style={styles.addOptionContent}>
                  <Text style={styles.addOptionTitle}>New Contact</Text>
                  <Text style={styles.addOptionSubtitle}>
                    Start a conversation with someone new
                  </Text>
                </View>
                <Text style={styles.addOptionArrow}>→</Text>
              </Pressable>

              <Pressable
                style={styles.addOption}
                onPress={() => {
                  // TODO: Navigate to add platform screen
                  setShowAddScreen(false);
                }}>
                <View style={styles.addOptionIcon}>
                  <Text style={styles.addOptionIconText}>💬</Text>
                </View>
                <View style={styles.addOptionContent}>
                  <Text style={styles.addOptionTitle}>New Platform</Text>
                  <Text style={styles.addOptionSubtitle}>Connect a messaging service</Text>
                </View>
                <Text style={styles.addOptionArrow}>→</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#201f1f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
    color: '#ede9e9',
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#201f1f',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#ede9e9',
    padding: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#201f1f',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#2a2a2a',
  },
  filterChipActive: {
    backgroundColor: '#ede9e9',
    borderColor: '#ede9e9',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
    color: '#999',
  },
  filterChipTextActive: {
    color: '#201f1f',
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ede9e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#201f1f',
  },
  platformBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ede9e9',
    borderWidth: 2,
    borderColor: '#201f1f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
    marginLeft: 8,
  },
  conversationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationMessage: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#ede9e9',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#201f1f',
  },
  conversationPlatform: {
    fontSize: 11,
    color: '#999',
  },
  // Chat View Styles
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
    fontFamily: 'OpenSans-SemiBold',
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
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(32, 31, 31, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'OpenSans-ExtraBold',
    color: '#ede9e9',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#ede9e9',
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
  },
  addOptions: {
    gap: 12,
  },
  addOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    backgroundColor: '#201f1f',
  },
  addOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addOptionIconText: {
    fontSize: 24,
  },
  addOptionContent: {
    flex: 1,
  },
  addOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    marginBottom: 4,
  },
  addOptionSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  addOptionArrow: {
    fontSize: 18,
    color: '#999',
    marginLeft: 8,
  },
});

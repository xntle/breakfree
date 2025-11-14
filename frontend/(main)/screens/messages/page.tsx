import * as React from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layers, Pencil, Search, MessageCircle, MessageSquare } from 'lucide-react-native';
import { useOnboard } from '(onboard)/OnboardingContext';
import type { MessagesStackParamList } from './MessagesStack';

type Conversation = {
  id: string;
  name: string;
  platform: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
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

export default function MessagesList() {
  const { allowedMessaging } = useOnboard();
  const navigation = useNavigation<NativeStackNavigationProp<MessagesStackParamList>>();
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerIconButton}>
          <Layers size={20} color="#ede9e9" strokeWidth={2} />
        </Pressable>
        <Text style={styles.headerTitle}>All Chat</Text>
        <Pressable onPress={() => setShowAddScreen(true)} style={styles.headerIconButton}>
          <Pencil size={20} color="#ede9e9" strokeWidth={2} />
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
            onPress={() => navigation.navigate('MessageDetail', { slug: conversation.id })}>
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
    paddingVertical: 8,
  },
  headerIconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'OpenSans-ExtraBold',
    color: '#ede9e9',
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
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
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
  },
  filterChipActive: {
    backgroundColor: '#ede9e9',
    borderColor: '#ede9e9',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Medium',
    color: '#999',
  },
  filterChipTextActive: {
    color: '#201f1f',
    fontFamily: 'OpenSans-Bold',
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
    backgroundColor: '#201f1f',
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
    fontFamily: 'OpenSans-Bold',
    color: '#201f1f',
  },
  platformBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ede9e9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#201f1f',
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
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
    fontFamily: 'OpenSans-Bold',
    color: '#201f1f',
  },
  conversationPlatform: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#666',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#201f1f',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    color: '#ede9e9',
  },
  addOptions: {
    paddingTop: 20,
  },
  addOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    fontFamily: 'OpenSans-Bold',
    color: '#ede9e9',
    marginBottom: 4,
  },
  addOptionSubtitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
  },
  addOptionArrow: {
    fontSize: 20,
    color: '#999',
    marginLeft: 8,
  },
});

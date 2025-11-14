import * as React from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layers, Pencil, Search, MessageCircle, MessageSquare } from 'lucide-react-native';
import { useOnboard } from '(onboard)/OnboardingContext';
import { useTheme } from '../../../contexts/ThemeContext';
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
  {
    id: '5',
    name: 'Sarah',
    platform: 'iMessage',
    lastMessage: 'Hey, are we still on for lunch?',
    time: '10:30 AM',
    unread: 2,
  },
  {
    id: '6',
    name: 'Mike',
    platform: 'WhatsApp',
    lastMessage: 'Thanks for the help yesterday!',
    time: '9:15 AM',
    unread: 0,
  },
  {
    id: '7',
    name: 'Team Chat',
    platform: 'Telegram',
    lastMessage: 'New project update available',
    time: '8:45 AM',
    unread: 5,
  },
  {
    id: '8',
    name: 'Mom',
    platform: 'iMessage',
    lastMessage: 'Call me when you get a chance',
    time: 'Yesterday',
    unread: 1,
  },
  {
    id: '9',
    name: 'Sarah',
    platform: 'iMessage',
    lastMessage: 'Hey, are we still on for lunch?',
    time: '10:30 AM',
    unread: 2,
  },
  {
    id: '10',
    name: 'Mike',
    platform: 'WhatsApp',
    lastMessage: 'Thanks for the help yesterday!',
    time: '9:15 AM',
    unread: 0,
  },
  {
    id: '11',
    name: 'Team Chat',
    platform: 'Telegram',
    lastMessage: 'New project update available',
    time: '8:45 AM',
    unread: 5,
  },
  {
    id: '12',
    name: 'Mom',
    platform: 'iMessage',
    lastMessage: 'Call me when you get a chance',
    time: 'Yesterday',
    unread: 1,
  },
];

const getPlatformIcon = (platform: string, color: string) => {
  const platformLower = platform.toLowerCase();
  if (platformLower.includes('imessage') || platformLower.includes('message')) {
    return <MessageCircle size={12} color={color} strokeWidth={2.5} />;
  }
  if (platformLower.includes('whatsapp')) {
    return <MessageSquare size={12} color={color} strokeWidth={2.5} />;
  }
  if (platformLower.includes('telegram')) {
    return <MessageCircle size={12} color={color} strokeWidth={2.5} />;
  }
  return <MessageCircle size={12} color={color} strokeWidth={2.5} />;
};

export default function MessagesList() {
  const { theme } = useTheme();
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

  // Generate dynamic styles based on theme
  const dynamicStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        headerBlur: {
          overflow: 'hidden',
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 8,
          backgroundColor: theme.colors.blurBackground,
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
          color: theme.colors.text,
          flex: 1,
          textAlign: 'center',
        },
        searchBlur: {
          overflow: 'hidden',
        },
        searchContainer: {
          paddingHorizontal: 20,
          paddingBottom: 12,
        },
        searchInputWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          paddingHorizontal: 12,
          height: 40,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        searchIcon: {
          marginRight: 8,
        },
        searchInput: {
          flex: 1,
          color: theme.colors.text,
          fontFamily: 'OpenSans-Regular',
          fontSize: 16,
        },
        filterContainer: {
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingBottom: 12,
          gap: 8,
        },
        filterChipBlur: {
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: theme.colors.blurSurface,
          borderWidth: 1,
          borderColor: theme.colors.blurBorder,
        },
        filterChip: {
          paddingHorizontal: 16,
          paddingVertical: 6,
        },
        filterChipActive: {
          backgroundColor: theme.colors.text,
          borderColor: theme.colors.text,
        },
        filterChipText: {
          fontSize: 14,
          fontFamily: 'OpenSans-Medium',
          color: theme.colors.textSecondary,
        },
        filterChipTextActive: {
          color: theme.colors.background,
          fontFamily: 'OpenSans-Bold',
        },
        conversationsList: {
          flex: 1,
        },
        conversationItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        avatarContainer: {
          position: 'relative',
          marginRight: 12,
        },
        avatar: {
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: theme.colors.surfaceSecondary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        avatarText: {
          fontSize: 20,
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
        },
        platformBadge: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: theme.colors.text,
          borderRadius: 8,
          width: 16,
          height: 16,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: theme.colors.background,
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
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
          flex: 1,
          marginRight: 8,
        },
        conversationTime: {
          fontSize: 12,
          fontFamily: 'OpenSans-Regular',
          color: theme.colors.textSecondary,
        },
        conversationFooter: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        conversationMessage: {
          fontSize: 14,
          fontFamily: 'OpenSans-Regular',
          color: theme.colors.textSecondary,
          flex: 1,
          marginRight: 8,
        },
        unreadBadge: {
          backgroundColor: theme.colors.text,
          borderRadius: 10,
          minWidth: 20,
          height: 20,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 6,
        },
        unreadBadgeText: {
          fontSize: 12,
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.background,
        },
        conversationPlatform: {
          fontSize: 10,
          fontFamily: 'OpenSans-Regular',
          color: theme.colors.textTertiary,
          marginTop: 4,
        },
        modalOverlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'flex-end',
        },
        modalContent: {
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 20,
          paddingBottom: 40,
          maxHeight: '80%',
        },
        modalHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        modalTitle: {
          fontSize: 24,
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
        },
        closeButton: {
          width: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
        },
        closeButtonText: {
          fontSize: 28,
          color: theme.colors.text,
        },
        addOptions: {
          padding: 20,
          gap: 16,
        },
        addOption: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        addOptionIcon: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.surfaceSecondary,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        },
        addOptionIconText: {
          fontSize: 20,
        },
        addOptionContent: {
          flex: 1,
        },
        addOptionTitle: {
          fontSize: 16,
          fontFamily: 'OpenSans-Bold',
          color: theme.colors.text,
          marginBottom: 2,
        },
        addOptionSubtitle: {
          fontSize: 12,
          fontFamily: 'OpenSans-Regular',
          color: theme.colors.textSecondary,
        },
        addOptionArrow: {
          fontSize: 20,
          color: theme.colors.textSecondary,
          marginLeft: 12,
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      {/* Conversations List */}
      <ScrollView
        style={dynamicStyles.conversationsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 0 }}>
        {/* Header */}
        <BlurView intensity={80} tint={theme.mode} style={dynamicStyles.headerBlur}>
          <View style={dynamicStyles.header}>
            <Pressable style={dynamicStyles.headerIconButton}>
              <Layers size={20} color={theme.colors.text} strokeWidth={2} />
            </Pressable>
            <Text style={dynamicStyles.headerTitle}>All Chat</Text>
            <Pressable
              onPress={() => setShowAddScreen(true)}
              style={dynamicStyles.headerIconButton}>
              <Pencil size={20} color={theme.colors.text} strokeWidth={2} />
            </Pressable>
          </View>
        </BlurView>

        {/* Search Bar */}
        <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.searchBlur}>
          <View style={dynamicStyles.searchContainer}>
            <View style={dynamicStyles.searchInputWrapper}>
              <Search
                size={18}
                color={theme.colors.textSecondary}
                style={dynamicStyles.searchIcon}
              />
              <TextInput
                style={dynamicStyles.searchInput}
                placeholder="Search conversations..."
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </BlurView>

        {/* Filter Chips */}
        <View style={dynamicStyles.filterContainer}>
          <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.filterChipBlur}>
            <Pressable
              style={[dynamicStyles.filterChip, filter === 'all' && dynamicStyles.filterChipActive]}
              onPress={() => setFilter('all')}>
              <Text
                style={[
                  dynamicStyles.filterChipText,
                  filter === 'all' && dynamicStyles.filterChipTextActive,
                ]}>
                All
              </Text>
            </Pressable>
          </BlurView>
          <BlurView intensity={60} tint={theme.mode} style={dynamicStyles.filterChipBlur}>
            <Pressable
              style={[
                dynamicStyles.filterChip,
                filter === 'unread' && dynamicStyles.filterChipActive,
              ]}
              onPress={() => setFilter('unread')}>
              <Text
                style={[
                  dynamicStyles.filterChipText,
                  filter === 'unread' && dynamicStyles.filterChipTextActive,
                ]}>
                Unread
              </Text>
            </Pressable>
          </BlurView>
        </View>
        {filteredConversations.map((conversation) => (
          <Pressable
            key={conversation.id}
            style={dynamicStyles.conversationItem}
            onPress={() => navigation.navigate('MessageDetail', { slug: conversation.id })}>
            {/* Avatar */}
            <View style={dynamicStyles.avatarContainer}>
              <View style={dynamicStyles.avatar}>
                <Text style={dynamicStyles.avatarText}>
                  {conversation.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={dynamicStyles.platformBadge}>
                {getPlatformIcon(conversation.platform, theme.colors.background)}
              </View>
            </View>

            {/* Content */}
            <View style={dynamicStyles.conversationContent}>
              <View style={dynamicStyles.conversationHeader}>
                <Text style={dynamicStyles.conversationName} numberOfLines={1}>
                  {conversation.name}
                </Text>
                <Text style={dynamicStyles.conversationTime}>{conversation.time}</Text>
              </View>
              <View style={dynamicStyles.conversationFooter}>
                <Text style={dynamicStyles.conversationMessage} numberOfLines={1}>
                  {conversation.lastMessage}
                </Text>
                {conversation.unread > 0 && (
                  <View style={dynamicStyles.unreadBadge}>
                    <Text style={dynamicStyles.unreadBadgeText}>{conversation.unread}</Text>
                  </View>
                )}
              </View>
              <Text style={dynamicStyles.conversationPlatform}>{conversation.platform}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Add Screen Modal */}
      {showAddScreen && (
        <Pressable style={dynamicStyles.modalOverlay} onPress={() => setShowAddScreen(false)}>
          <Pressable style={dynamicStyles.modalContent} onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Add New</Text>
              <Pressable onPress={() => setShowAddScreen(false)} style={dynamicStyles.closeButton}>
                <Text style={dynamicStyles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            {/* Options */}
            <View style={dynamicStyles.addOptions}>
              <Pressable
                style={dynamicStyles.addOption}
                onPress={() => {
                  // TODO: Navigate to add new person screen
                  setShowAddScreen(false);
                }}>
                <View style={dynamicStyles.addOptionIcon}>
                  <Text style={dynamicStyles.addOptionIconText}>👤</Text>
                </View>
                <View style={dynamicStyles.addOptionContent}>
                  <Text style={dynamicStyles.addOptionTitle}>New Contact</Text>
                  <Text style={dynamicStyles.addOptionSubtitle}>
                    Start a conversation with someone new
                  </Text>
                </View>
                <Text style={dynamicStyles.addOptionArrow}>→</Text>
              </Pressable>

              <Pressable
                style={dynamicStyles.addOption}
                onPress={() => {
                  // TODO: Navigate to add platform screen
                  setShowAddScreen(false);
                }}>
                <View style={dynamicStyles.addOptionIcon}>
                  <Text style={dynamicStyles.addOptionIconText}>💬</Text>
                </View>
                <View style={dynamicStyles.addOptionContent}>
                  <Text style={dynamicStyles.addOptionTitle}>New Platform</Text>
                  <Text style={dynamicStyles.addOptionSubtitle}>Connect a messaging service</Text>
                </View>
                <Text style={dynamicStyles.addOptionArrow}>→</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

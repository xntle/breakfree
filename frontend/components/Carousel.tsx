// src/components/Carousel.tsx
import React, { useRef } from 'react';
import {
  Animated,
  View,
  Text,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');

type Item = { title: string; body?: string };
export default function Carousel({ items, height = 360 }: { items: Item[]; height?: number }) {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={{ width: '100%', height, backgroundColor: 'transparent', overflow: 'hidden' }}>
      {/* Slides */}
      <Animated.FlatList
        data={items}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_W, height, alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '800',
                color: '#0B0F14',
                textAlign: 'center',
                marginBottom: 8,
              }}>
              {item.title}
            </Text>
            {item.body ? (
              <Text
                style={{
                  fontSize: 14,
                  color: '#4B5563',
                  textAlign: 'center',
                  paddingHorizontal: 24,
                }}>
                {item.body}
              </Text>
            ) : null}
          </View>
        )}
      />

      {/* Dots */}
      <View
        style={{
          position: 'absolute',
          bottom: 14,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        }}>
        {items.map((_, i) => {
          const inputRange = [(i - 1) * SCREEN_W, i * SCREEN_W, (i + 1) * SCREEN_W];
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.3, 1],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                backgroundColor: '#0B0F14',
                opacity,
                transform: [{ scale }],
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

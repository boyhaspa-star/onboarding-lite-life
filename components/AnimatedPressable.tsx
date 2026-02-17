import React, { useRef, useCallback } from 'react';
import { StyleProp, ViewStyle, Animated, Pressable } from 'react-native';

interface AnimatedPressableProps {
  onPress?: () => void;
  /** Scale when pressed — default 0.96 (subtle) */
  scaleValue?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  children: React.ReactNode;
}

/**
 * Drop-in replacement for TouchableOpacity with spring-scale press feedback.
 * Uses plain RN Animated for broad compatibility.
 *
 * Usage:
 *   <AnimatedPressable onPress={handleTap}>
 *     <CardContent />
 *   </AnimatedPressable>
 */
export function AnimatedPressable({
  onPress,
  scaleValue = 0.96,
  style,
  disabled = false,
  children,
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: scaleValue,
      useNativeDriver: true,
      damping: 15,
      stiffness: 200,
    }).start();
  }, [scaleValue]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 200,
    }).start();
  }, []);

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} disabled={disabled}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

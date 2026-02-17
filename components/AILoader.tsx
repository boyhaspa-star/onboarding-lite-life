import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, typography, spacing } from '@/constants/theme';

export type LoaderIconType = 'brain' | 'user' | 'dumbbell' | 'chart' | 'heart' | 'target' | 'rocket';

interface AILoaderProps {
  title: string;
  messages: string[];
  accentColor?: string;
  icon: React.ReactNode;
  onComplete?: () => void;
  duration?: number;
}

export default function AILoader({
  title,
  messages,
  accentColor = '#CDFC00',
  icon,
  onComplete,
  duration = 3000,
}: AILoaderProps) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const onCompleteRef = useRef(onComplete);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Keep the ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Spin animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Progress bar
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, Math.floor(duration / messages.length));

    // Callback on complete
    const timeout = setTimeout(() => {
      onCompleteRef.current?.();
    }, duration);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(timeout);
    };
  }, [duration, messages.length]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Animated Icon */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}>
        {/* Outer Ring */}
        <Animated.View
          style={[
            styles.spinningRing,
            { transform: [{ rotate: spinInterpolate }] },
          ]}>
          <Svg width={140} height={140} viewBox="0 0 140 140">
            <Defs>
              <LinearGradient id="ringGrad" x1="0" y1="0" x2="140" y2="140">
                <Stop offset="0" stopColor={accentColor} stopOpacity="1" />
                <Stop offset="0.5" stopColor={accentColor} stopOpacity="0.3" />
                <Stop offset="1" stopColor={accentColor} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Circle
              cx="70"
              cy="70"
              r="65"
              stroke="url(#ringGrad)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="200 200"
            />
          </Svg>
        </Animated.View>

        {/* Center Icon */}
        <View style={[styles.centerIcon, { backgroundColor: `${accentColor}15` }]}>
          {icon}
        </View>
      </Animated.View>

      {/* Loading Text */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{messages[currentMessageIndex]}</Text>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: accentColor,
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['4xl'],
    backgroundColor: colors.background.primary,
  },
  iconContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['4xl'],
  },
  spinningRing: {
    position: 'absolute',
  },
  centerIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: colors.text.subtle,
    textAlign: 'center',
    marginBottom: spacing['4xl'],
    height: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: colors.overlay.white10,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

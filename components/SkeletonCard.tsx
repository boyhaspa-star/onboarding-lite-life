import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated, Easing } from 'react-native';
import { colors, spacing } from '@/constants/theme';

// ─── Skeleton Primitives ────────────────────────────────

interface SkeletonBoxProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/** Low-level pulsing skeleton shape */
function SkeletonBox({ width, height, borderRadius = spacing.radius.md, style }: SkeletonBoxProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.gray[1200],
          opacity,
        },
        style,
      ]}
    />
  );
}

// ─── Workout Card Skeleton ──────────────────────────────

/** Matches the workout card layout in (tabs)/workout.tsx */
export function WorkoutCardSkeleton() {
  return (
    <View style={workoutStyles.card}>
      <View style={workoutStyles.content}>
        {/* Title lines */}
        <View style={workoutStyles.textArea}>
          <SkeletonBox width={120} height={20} borderRadius={6} />
          <SkeletonBox width={80} height={14} borderRadius={4} style={{ marginTop: 8 }} />
          <View style={workoutStyles.metaRow}>
            <SkeletonBox width={50} height={12} borderRadius={4} />
            <SkeletonBox width={70} height={12} borderRadius={4} />
          </View>
        </View>
        {/* Body + ring area */}
        <View style={workoutStyles.rightArea}>
          <SkeletonBox width={60} height={90} borderRadius={12} />
          <SkeletonBox width={48} height={48} borderRadius={24} />
        </View>
      </View>
      {/* Start button area */}
      <SkeletonBox
        width={160}
        height={40}
        borderRadius={spacing.radius.lg}
        style={workoutStyles.button}
      />
    </View>
  );
}

const workoutStyles = StyleSheet.create({
  card: {
    height: 160,
    borderRadius: spacing.radius.lg,
    backgroundColor: colors.background.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.muted,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    paddingBottom: 50,
  },
  textArea: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  rightArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  button: {
    position: 'absolute',
    bottom: 1,
    left: 1,
  },
});

// ─── Exercise Grid Card Skeleton ────────────────────────

/** Matches the exercise grid card layout in exercises/[id].tsx */
export function ExerciseCardSkeleton({ width }: { width: number }) {
  return (
    <View style={[exerciseStyles.card, { width, height: width * 1.25 }]}>
      {/* Body placeholder */}
      <SkeletonBox width={width * 0.5} height={width * 0.6} borderRadius={8} style={{ alignSelf: 'center', marginTop: 16 }} />
      {/* Bottom text area */}
      <View style={exerciseStyles.bottom}>
        <SkeletonBox width={width * 0.65} height={14} borderRadius={4} />
        <SkeletonBox width={width * 0.5} height={10} borderRadius={3} style={{ marginTop: 6 }} />
        <SkeletonBox width={width * 0.4} height={18} borderRadius={10} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

const exerciseStyles = StyleSheet.create({
  card: {
    borderRadius: spacing.radius.xl,
    backgroundColor: colors.background.surface,
    overflow: 'hidden',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border.muted,
  },
  bottom: {
    padding: spacing.lg,
  },
});

/**
 * ProgressDots — Shared Onboarding Component
 *
 * Replaces 5 identical copies across onboarding screens.
 *
 * Usage:
 *   <ProgressDots total={4} active={2} />
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/constants/theme';

interface ProgressDotsProps {
  /** Total number of steps */
  total: number;
  /** Number of active (completed) dots (1-based) */
  active: number;
}

export function ProgressDots({ total, active }: ProgressDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, i < active && styles.dotActive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing['3xl'],
  },
  dot: {
    width: spacing.progressDotWidth,
    height: spacing.progressDotHeight,
    borderRadius: spacing.radius.xs,
    backgroundColor: colors.gray[800],
  },
  dotActive: {
    backgroundColor: colors.brand.primary,
  },
});

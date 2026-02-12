/**
 * BackButton — Shared Back Navigation Button
 *
 * Replaces 3 duplicate back button patterns.
 *
 * Variants:
 *   - "circle" (default): Circular glass background, 24px icon
 *   - "plain": No background, 28px icon, flex-start alignment
 *
 * Usage:
 *   <BackButton />
 *   <BackButton variant="plain" />
 *   <BackButton onPress={customHandler} />
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors, spacing } from '@/constants/theme';

type BackButtonVariant = 'circle' | 'plain';

interface BackButtonProps {
  variant?: BackButtonVariant;
  onPress?: () => void;
}

export function BackButton({ variant = 'circle', onPress }: BackButtonProps) {
  const router = useRouter();
  const handlePress = onPress ?? (() => router.back());
  const iconSize = variant === 'plain' ? 28 : 24;

  return (
    <TouchableOpacity
      style={[styles.base, variant === 'circle' && styles.circle]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <ChevronLeft size={iconSize} color={colors.text.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: spacing.iconButton,
    height: spacing.iconButton,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  circle: {
    borderRadius: spacing.iconButton / 2,
    backgroundColor: colors.overlay.white5,
    alignItems: 'center',
  },
});

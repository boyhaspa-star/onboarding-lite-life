/**
 * GlassCard — Shared Card Component
 *
 * Semi-transparent card with subtle border, used across
 * onboarding and exercise screens.
 *
 * Variants:
 *   - "default": Standard glass card — rgba fill + subtle border
 *   - "selection": Selectable card with active/selected state
 *   - "benefit": Row-based card for icon + text combos
 *
 * Usage:
 *   <GlassCard>{children}</GlassCard>
 *   <GlassCard variant="selection" selected={isActive}>{children}</GlassCard>
 *   <GlassCard variant="benefit">{children}</GlassCard>
 */

import React, { type ReactNode } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors, spacing } from '@/constants/theme';

type CardVariant = 'default' | 'selection' | 'benefit';

interface GlassCardProps {
  children: ReactNode;
  variant?: CardVariant;
  /** Only used when variant="selection" */
  selected?: boolean;
  /** Makes the card pressable */
  onPress?: () => void;
  style?: ViewStyle;
}

export function GlassCard({
  children,
  variant = 'default',
  selected = false,
  onPress,
  style,
}: GlassCardProps) {
  const cardStyle = [
    styles.base,
    variant === 'selection' && styles.selection,
    variant === 'selection' && selected && styles.selectionActive,
    variant === 'benefit' && styles.benefit,
    style,
  ];

  if (onPress) {
    return (
      <Pressable style={cardStyle} onPress={onPress}>
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.overlay.dark50,
    borderRadius: spacing.radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  selection: {
    minHeight: 110,
    justifyContent: 'center',
  },
  selectionActive: {
    borderColor: colors.brand.primary,
    borderWidth: 2,
    backgroundColor: colors.overlay.accent5,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.overlay.white3,
    borderColor: colors.gray[800],
    borderRadius: spacing.radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
});

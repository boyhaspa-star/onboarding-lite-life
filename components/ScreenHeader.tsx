import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors, typography, spacing } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Show back arrow (defaults to true) */
  showBack?: boolean;
  onBack?: () => void;
  /** Extra element to the right of the title (e.g. badge) */
  titleRight?: React.ReactNode;
  /** Element in the right slot */
  right?: React.ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  titleRight,
  right,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack ?? (() => router.back())}
          activeOpacity={0.7}>
          <ChevronLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}

      <View style={styles.titleArea}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {titleRight}
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {right ?? <View style={styles.spacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screen.paddingHorizontal,
    paddingTop: spacing.screen.paddingTop,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: spacing.iconButton,
    height: spacing.iconButton,
    borderRadius: spacing.iconButtonRadius,
    backgroundColor: colors.overlay.white8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleArea: {
    flex: 1,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 22,
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.disabled,
    marginTop: 2,
  },
  spacer: {
    width: spacing.iconButton,
  },
});

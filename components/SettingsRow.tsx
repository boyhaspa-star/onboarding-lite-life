import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography, spacing } from '@/constants/theme';

// ─── Settings Row ───────────────────────────────────────

interface SettingsRowProps {
  /** Icon element on the left */
  icon?: React.ReactNode;
  label: string;
  /** Subtext below the label */
  description?: string;
  /** Right side: arrow (default), toggle, or custom element */
  right?: 'arrow' | 'toggle' | React.ReactNode;
  /** Current toggle value (when right='toggle') */
  toggled?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  /** Destructive styling (red text) */
  destructive?: boolean;
  style?: ViewStyle;
}

export function SettingsRow({
  icon,
  label,
  description,
  right = 'arrow',
  toggled = false,
  onPress,
  onToggle,
  destructive = false,
  style,
}: SettingsRowProps) {
  const content = (
    <View style={[styles.row, style]}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <View style={styles.labelArea}>
        <Text style={[styles.label, destructive && styles.labelDestructive]}>
          {label}
        </Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {right === 'toggle' ? (
        <Switch
          value={toggled}
          onValueChange={onToggle}
          trackColor={{ false: colors.gray[1200], true: colors.brand.primary }}
          thumbColor={colors.text.primary}
        />
      ) : right === 'arrow' ? (
        <ChevronRight size={20} color={colors.gray[800]} />
      ) : (
        right
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

// ─── Settings Section ───────────────────────────────────

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View style={sectionStyles.container}>
      {title && <Text style={sectionStyles.title}>{title}</Text>}
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.muted,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.overlay.white8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  labelArea: {
    flex: 1,
  },
  label: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  labelDestructive: {
    color: '#FF4444',
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.text.disabled,
    marginTop: 2,
  },
});

const sectionStyles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.disabled,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  card: {
    backgroundColor: colors.background.surface,
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.muted,
  },
});

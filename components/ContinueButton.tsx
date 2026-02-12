/**
 * ContinueButton — Shared CTA Button
 *
 * Replaces 6 duplicate CTA button patterns found across
 * onboarding and exercise screens.
 *
 * Variants:
 *   - "orange" (default): Orange CTA — #FF6B35
 *   - "lime": Lime/neon green — #CDFC00
 *   - "yellow": Yellow with shadow — #E6FE58
 *
 * Usage:
 *   <ContinueButton label="Next" onPress={fn} />
 *   <ContinueButton label="Complete" onPress={fn} disabled variant="lime" />
 *   <ContinueButton label="Let's Go" onPress={fn} variant="yellow" icon={<ArrowRight />} />
 */

import React, { type ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { colors, typography, spacing } from '@/constants/theme';

type ButtonVariant = 'orange' | 'lime' | 'yellow';

interface ContinueButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  /** Optional icon rendered after the label */
  icon?: ReactNode;
  /** Override styles */
  style?: ViewStyle;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string }> = {
  orange: { bg: colors.brand.cta, text: colors.text.primary },
  lime: { bg: colors.brand.primary, text: colors.text.inverse },
  yellow: { bg: '#E6FE58', text: colors.text.inverse },
};

export function ContinueButton({
  label,
  onPress,
  disabled = false,
  variant = 'orange',
  icon,
  style,
}: ContinueButtonProps) {
  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: v.bg },
        variant === 'yellow' && styles.shadow,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.label,
          { color: v.text },
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  buttonDisabled: {
    backgroundColor: colors.gray[900],
  },
  label: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
  },
  labelDisabled: {
    color: colors.gray[600],
  },
  shadow: {
    shadowColor: '#E6FE58',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});

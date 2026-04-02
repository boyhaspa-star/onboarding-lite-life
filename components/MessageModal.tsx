/**
 * MessageModal — Reusable Animated Message Modal
 *
 * A beautiful bottom-sheet style modal for alerts, confirmations,
 * warnings, and informational messages across the app.
 *
 * Variants:
 *   - "info"    — Lime accent, for general information
 *   - "warning" — Orange accent, for warnings/consent needed
 *   - "success" — Green accent, for confirmations
 *   - "error"   — Red accent, for errors
 *
 * Usage:
 *   <MessageModal
 *     visible={showModal}
 *     onClose={() => setShowModal(false)}
 *     variant="warning"
 *     icon={<ShieldAlert size={32} color={colors.brand.cta} />}
 *     title="Consent Required"
 *     message="Please accept the privacy policy before using camera tracking."
 *     primaryLabel="Got It"
 *     onPrimary={() => setShowModal(false)}
 *   />
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Easing,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ModalVariant = 'info' | 'warning' | 'success' | 'error';

interface MessageModalProps {
  visible: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  /** Custom icon displayed at the top */
  icon?: React.ReactNode;
  title: string;
  message: string;
  /** Primary action button label */
  primaryLabel?: string;
  onPrimary?: () => void;
  /** Optional secondary button label */
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Whether to show the close (X) button — default true */
  showClose?: boolean;
  /** Haptic on show — default true */
  hapticOnShow?: boolean;
}

const variantConfig: Record<ModalVariant, {
  accentColor: string;
  bgGradient: [string, string];
  glowColor: string;
  iconBg: string;
  btnBg: string;
  btnText: string;
}> = {
  info: {
    accentColor: colors.brand.primary,
    bgGradient: ['rgba(205, 252, 0, 0.06)', 'rgba(205, 252, 0, 0.01)'],
    glowColor: 'rgba(205, 252, 0, 0.15)',
    iconBg: 'rgba(205, 252, 0, 0.12)',
    btnBg: colors.brand.primary,
    btnText: colors.text.inverse,
  },
  warning: {
    accentColor: colors.brand.cta,
    bgGradient: ['rgba(255, 107, 53, 0.08)', 'rgba(255, 107, 53, 0.01)'],
    glowColor: 'rgba(255, 107, 53, 0.15)',
    iconBg: 'rgba(255, 107, 53, 0.12)',
    btnBg: colors.brand.cta,
    btnText: colors.text.primary,
  },
  success: {
    accentColor: colors.brand.green,
    bgGradient: ['rgba(34, 197, 94, 0.08)', 'rgba(34, 197, 94, 0.01)'],
    glowColor: 'rgba(34, 197, 94, 0.15)',
    iconBg: 'rgba(34, 197, 94, 0.12)',
    btnBg: colors.brand.green,
    btnText: colors.text.primary,
  },
  error: {
    accentColor: '#EF4444',
    bgGradient: ['rgba(239, 68, 68, 0.08)', 'rgba(239, 68, 68, 0.01)'],
    glowColor: 'rgba(239, 68, 68, 0.15)',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    btnBg: '#EF4444',
    btnText: colors.text.primary,
  },
};

export function MessageModal({
  visible,
  onClose,
  variant = 'info',
  icon,
  title,
  message,
  primaryLabel = 'OK',
  onPrimary,
  secondaryLabel,
  onSecondary,
  showClose = true,
  hapticOnShow = true,
}: MessageModalProps) {
  const config = variantConfig[variant];

  // Animations
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(300)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (hapticOnShow) {
        Haptics.notificationAsync(
          variant === 'error'
            ? Haptics.NotificationFeedbackType.Error
            : variant === 'warning'
            ? Haptics.NotificationFeedbackType.Warning
            : Haptics.NotificationFeedbackType.Success,
        );
      }

      // Reset values
      backdropOpacity.setValue(0);
      slideY.setValue(300);
      cardScale.setValue(0.9);
      cardOpacity.setValue(0);
      iconScale.setValue(0);
      contentOpacity.setValue(0);

      // Entrance — everything in parallel for snappy appearance
      Animated.parallel([
        // Backdrop fade in
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        // Card slide up + scale
        Animated.spring(slideY, {
          toValue: 0,
          damping: 20,
          mass: 0.8,
          stiffness: 260,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          damping: 16,
          mass: 0.8,
          stiffness: 260,
          useNativeDriver: true,
        }),
        // Icon bounce in — with tiny delay via initial value overshoot
        Animated.spring(iconScale, {
          toValue: 1,
          damping: 10,
          mass: 0.6,
          stiffness: 300,
          useNativeDriver: true,
        }),
        // Content fades in immediately
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      // Looping glow
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowPulse, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowPulse, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [visible]);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Exit animation
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideY, {
        toValue: 300,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const handlePrimary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onPrimary) onPrimary();
    else handleClose();
  };

  const handleSecondary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onSecondary) onSecondary();
    else handleClose();
  };

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>

      {/* Modal Content */}
      <View style={styles.modalContainer} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [
                { translateY: slideY },
                { scale: cardScale },
              ],
            },
          ]}
        >
          {/* Gradient background */}
          <LinearGradient
            colors={[config.bgGradient[0], '#141414', '#141414']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Accent glow at top */}
          <Animated.View
            style={[
              styles.topGlow,
              { backgroundColor: config.glowColor, opacity: glowOpacity },
            ]}
          />

          {/* Close button */}
          {showClose && (
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X size={18} color={colors.text.muted} />
            </TouchableOpacity>
          )}

          {/* Content */}
          <View style={styles.cardContent}>
            {/* Icon */}
            {icon && (
              <Animated.View
                style={[
                  styles.iconWrap,
                  { backgroundColor: config.iconBg, transform: [{ scale: iconScale }] },
                ]}
              >
                {icon}
              </Animated.View>
            )}

            {/* Title & Message */}
            <Animated.View style={[styles.textSection, { opacity: contentOpacity }]}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </Animated.View>

            {/* Buttons */}
            <Animated.View style={[styles.buttonSection, { opacity: contentOpacity }]}>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: config.btnBg }]}
                onPress={handlePrimary}
                activeOpacity={0.85}
              >
                <Text style={[styles.primaryBtnText, { color: config.btnText }]}>
                  {primaryLabel}
                </Text>
              </TouchableOpacity>

              {secondaryLabel && (
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={handleSecondary}
                  activeOpacity={0.7}
                >
                  <Text style={styles.secondaryBtnText}>{secondaryLabel}</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>

          {/* Accent line at top */}
          <View style={[styles.accentLine, { backgroundColor: config.accentColor }]} />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: SCREEN_WIDTH - spacing.xl * 2,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: colors.overlay.white10,
  },
  topGlow: {
    position: 'absolute',
    top: -60,
    left: '20%',
    right: '20%',
    height: 120,
    borderRadius: 60,
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: spacing.radius.xl,
    borderTopRightRadius: spacing.radius.xl,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.overlay.white8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cardContent: {
    padding: spacing['3xl'],
    paddingTop: spacing['4xl'],
    alignItems: 'center',
    gap: spacing.xl,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonSection: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: spacing.radius['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bodyBold,
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: typography.fontSize.base,
    color: colors.text.muted,
    fontWeight: '500',
  },
});

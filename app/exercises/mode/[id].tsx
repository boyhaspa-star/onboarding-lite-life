/**
 * Workout Mode Selection Screen
 *
 * Appears after tapping "Start Exercise" on the plan page.
 * Two choices:
 *   1. "Track My Form" — camera-based pose tracking for correct form
 *   2. "Just Do It"    — freeform workout without tracking
 *
 * Design: dark cinematic feel, animated body silhouette backdrop,
 * two glowing glass cards with icon + description, fade-in stagger.
 */

import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Rect,
  Circle as SvgCircle,
  LinearGradient as SvgLinearGradient,
} from 'react-native-svg';
import {
  ScanEye,
  Dumbbell,
  ChevronLeft,
  Sparkles,
  Shield,
  Zap,
  Check,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '@/constants/theme';
import { getWorkoutById } from '@/data/workouts';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { MessageModal } from '@/components/MessageModal';
import { useUserGender } from '@/hooks/useUserGender';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Animated SVG glow orb ─────────────────────────────

function GlowOrb({ color, size, x, y, delay }: {
  color: string;
  size: number;
  x: number;
  y: number;
  delay: number;
}) {
  const pulse = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.7,
          duration: 2400,
          delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.3,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: pulse,
      }}
    />
  );
}

// ─── Main Screen ────────────────────────────────────────

export default function WorkoutModeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userGender = useUserGender();
  const workout = getWorkoutById(id || '1');
  const [consentChecked, setConsentChecked] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Entrance animations
  const bgFade = useRef(new Animated.Value(0)).current;
  const bodyScale = useRef(new Animated.Value(0.8)).current;
  const bodyOpacity = useRef(new Animated.Value(0)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-30)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const card1Fade = useRef(new Animated.Value(0)).current;
  const card1Slide = useRef(new Animated.Value(60)).current;
  const card2Fade = useRef(new Animated.Value(0)).current;
  const card2Slide = useRef(new Animated.Value(60)).current;
  const footerFade = useRef(new Animated.Value(0)).current;

  // Looping glow on cards
  const glowPulse1 = useRef(new Animated.Value(0)).current;
  const glowPulse2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance
    Animated.stagger(100, [
      // BG
      Animated.timing(bgFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Body silhouette
      Animated.parallel([
        Animated.spring(bodyScale, {
          toValue: 1,
          damping: 14,
          mass: 1,
          useNativeDriver: true,
        }),
        Animated.timing(bodyOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Title
      Animated.parallel([
        Animated.timing(titleFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
      // Subtitle
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Card 1
      Animated.parallel([
        Animated.timing(card1Fade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(card1Slide, {
          toValue: 0,
          damping: 16,
          mass: 1,
          useNativeDriver: true,
        }),
      ]),
      // Card 2
      Animated.parallel([
        Animated.timing(card2Fade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(card2Slide, {
          toValue: 0,
          damping: 16,
          mass: 1,
          useNativeDriver: true,
        }),
      ]),
      // Footer
      Animated.timing(footerFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Looping glow pulses
    const loopGlow = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();

    loopGlow(glowPulse1, 0);
    loopGlow(glowPulse2, 1000);
  }, []);

  const handleTrackMode = () => {
    if (!consentChecked) {
      setShowConsentModal(true);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push(`/exercises/${id}?mode=smart`);
  };

  const handleFreeMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/exercises/${id}?mode=free`);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  if (!workout) {
    router.back();
    return null;
  }

  // Interpolate glow opacity for cards
  const glow1Opacity = glowPulse1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.35],
  });
  const glow2Opacity = glowPulse2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.35],
  });

  return (
    <View style={styles.root}>
      {/* ── Background Layer ── */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: bgFade }]}>
        <LinearGradient
          colors={['#0A0A0A', '#0D0D0D', '#050505']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Ambient glow orbs */}
        <GlowOrb color="rgba(205, 252, 0, 0.06)" size={300} x={-80} y={100} delay={0} />
        <GlowOrb color="rgba(205, 252, 0, 0.05)" size={250} x={SCREEN_WIDTH - 120} y={SCREEN_HEIGHT - 400} delay={800} />
        <GlowOrb color="rgba(205, 252, 0, 0.04)" size={200} x={SCREEN_WIDTH - 180} y={60} delay={400} />
      </Animated.View>

      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* ── Back Button ── */}
        <AnimatedPressable onPress={handleBack} style={styles.backBtn}>
          <ChevronLeft size={22} color={colors.text.primary} />
        </AnimatedPressable>



        {/* ── Content ── */}
        <View style={styles.content}>
          {/* Workout info */}
          <View style={styles.topSection}>
            <Animated.Text
              style={[
                styles.workoutLabel,
                { opacity: subtitleFade },
              ]}
            >
              {workout.title.toUpperCase()} WORKOUT
            </Animated.Text>

            <Animated.Text
              style={[
                styles.title,
                {
                  opacity: titleFade,
                  transform: [{ translateY: titleSlide }],
                },
              ]}
            >
              How do you want{'\n'}to train?
            </Animated.Text>

            <Animated.Text
              style={[styles.subtitle, { opacity: subtitleFade }]}
            >
              Choose your workout experience
            </Animated.Text>
          </View>

          {/* ── Mode Cards ── */}
          <View style={styles.cardsSection}>
            {/* Card 1 — Track My Form */}
            <Animated.View
              style={[
                styles.cardWrapper,
                {
                  opacity: card1Fade,
                  transform: [{ translateY: card1Slide }],
                },
              ]}
            >
              <AnimatedPressable onPress={handleTrackMode} style={styles.card}>
                {/* Glow border effect */}
                <Animated.View
                  style={[styles.cardGlow, styles.cardGlowLime, { opacity: glow1Opacity }]}
                />

                {/* Card background */}
                <LinearGradient
                  colors={['rgba(205, 252, 0, 0.18)', 'rgba(205, 252, 0, 0.06)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                />

                <View style={styles.cardInner}>
                  {/* Icon */}
                  <View style={[styles.iconContainer, styles.iconLime]}>
                    <ScanEye size={28} color={colors.brand.primary} />
                  </View>

                  {/* Text */}
                  <View style={styles.cardTextSection}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cardTitle}>Track My Form</Text>
                      <View style={styles.aiBadge}>
                        <Sparkles size={10} color={colors.brand.primary} />
                        <Text style={styles.aiBadgeText}>AI</Text>
                      </View>
                    </View>
                    <Text style={styles.cardDescription}>
                      Real-time pose tracking with AI feedback on your form
                    </Text>
                    <Text style={styles.poweredBy}>
                      Powered by Google ML Kit
                    </Text>
                  </View>

                  {/* Features */}
                  <View style={styles.featureRow}>
                    <View style={[styles.featureChip, styles.featureChipLime]}>
                      <Shield size={12} color={colors.brand.primary} />
                      <Text style={[styles.featureText, styles.featureTextLime]}>Form Check</Text>
                    </View>
                    <View style={[styles.featureChip, styles.featureChipLime]}>
                      <Zap size={12} color={colors.brand.primary} />
                      <Text style={[styles.featureText, styles.featureTextLime]}>Rep Counter</Text>
                    </View>
                  </View>
                </View>
              </AnimatedPressable>
            </Animated.View>

            {/* Card 2 — Just Do It */}
            <Animated.View
              style={[
                styles.cardWrapper,
                {
                  opacity: card2Fade,
                  transform: [{ translateY: card2Slide }],
                },
              ]}
            >
              <AnimatedPressable onPress={handleFreeMode} style={styles.card}>
                {/* Glow border effect */}
                <Animated.View
                  style={[styles.cardGlow, styles.cardGlowOrange, { opacity: glow2Opacity }]}
                />

                {/* Card background */}
                <LinearGradient
                  colors={['rgba(255, 107, 53, 0.18)', 'rgba(255, 107, 53, 0.06)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                />

                <View style={styles.cardInner}>
                  {/* Icon */}
                  <View style={[styles.iconContainer, styles.iconOrange]}>
                    <Dumbbell size={28} color={colors.brand.cta} />
                  </View>

                  {/* Text */}
                  <View style={styles.cardTextSection}>
                    <Text style={styles.cardTitle}>Just Do It</Text>
                    <Text style={styles.cardDescription}>
                      Follow the workout at your own pace, no camera needed
                    </Text>
                  </View>

                  {/* Features */}
                  <View style={styles.featureRow}>
                    <View style={styles.featureChipOrange}>
                      <Zap size={12} color={colors.brand.cta} />
                      <Text style={styles.featureTextOrange}>Timer</Text>
                    </View>
                    <View style={styles.featureChipOrange}>
                      <Dumbbell size={12} color={colors.brand.cta} />
                      <Text style={styles.featureTextOrange}>Guide</Text>
                    </View>
                  </View>
                </View>
              </AnimatedPressable>
            </Animated.View>
          </View>

          {/* ── Consent Checkbox ── */}
          <Animated.View style={[styles.consentRow, { opacity: footerFade }]}>
            <TouchableOpacity
              style={[styles.checkbox, consentChecked && styles.checkboxChecked]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setConsentChecked(!consentChecked);
              }}
              activeOpacity={0.7}
            >
              {consentChecked && <Check size={14} color={colors.text.inverse} strokeWidth={3} />}
            </TouchableOpacity>
            <Text style={styles.consentText}>
              I agree to camera usage for pose tracking and accept the{' '}
              <Text style={styles.consentLink}>Privacy Policy</Text>
            </Text>
          </Animated.View>

          {/* ── Footer ── */}
          <Animated.View style={[styles.footer, { opacity: footerFade }]}>
            <Text style={styles.footerText}>
              {workout.exerciseCount} exercises · {workout.duration} · {workout.calories} cal
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>

      {/* Consent Modal */}
      <MessageModal
        visible={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        variant="warning"
        icon={<Shield size={32} color={colors.brand.cta} />}
        title="Consent Required"
        message="Please accept the camera & privacy policy consent before using AI-powered pose tracking."
        primaryLabel="Got It"
        onPrimary={() => setShowConsentModal(false)}
      />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050505',
  },
  container: {
    flex: 1,
  },
  backBtn: {
    position: 'absolute',
    top: 56,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.overlay.white8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  // Body backdrop
  bodyBackdrop: {
    position: 'absolute',
    top: -20,
    right: -50,
    opacity: 0.1,
    zIndex: 0,
  },

  // Content layout
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen.paddingHorizontal,
    justifyContent: 'flex-end',
    paddingBottom: spacing['3xl'],
    zIndex: 1,
  },

  // Top section
  topSection: {
    marginBottom: spacing['4xl'],
  },
  workoutLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.brand.primary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 34,
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
    lineHeight: 40,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.xl,
    color: colors.text.secondary,
    fontWeight: '500',
  },

  // Cards
  cardsSection: {
    gap: spacing.lg,
    marginBottom: spacing['3xl'],
  },
  cardWrapper: {
    borderRadius: spacing.radius.xl,
    overflow: 'visible',
  },
  card: {
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    position: 'relative',
  },
  cardGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: spacing.radius.xl,
    borderWidth: 1.5,
  },

  cardGlowLime: {
    borderColor: 'rgba(205, 252, 0, 0.4)',
    shadowColor: '#CDFC00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  cardGlowOrange: {
    borderColor: 'rgba(255, 107, 53, 0.4)',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardInner: {
    padding: spacing.xl,
    gap: spacing.lg,
  },

  // Icon container
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconLime: {
    backgroundColor: 'rgba(205, 252, 0, 0.12)',
  },
  iconOrange: {
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
  },

  // Card text
  cardTextSection: {
    gap: spacing.xs,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
  },
  cardDescription: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  poweredBy: {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: 2,
  },

  // AI badge
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(205, 252, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.brand.primary,
    letterSpacing: 1,
  },

  // Feature chips
  featureRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(205, 252, 0, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  featureChipLime: {
    backgroundColor: 'rgba(205, 252, 0, 0.08)',
  },
  featureChipOrange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 107, 53, 0.10)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  featureText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.brand.primary,
  },
  featureTextLime: {
    color: colors.brand.primary,
  },
  featureTextOrange: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.brand.cta,
  },

  // Footer
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.fontSize.base,
    color: colors.text.muted,
    fontWeight: '500',
  },

  // Consent
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.gray[700],
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  consentText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.muted,
    lineHeight: 18,
  },
  consentLink: {
    color: colors.brand.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // Disabled card
  cardDisabled: {
    opacity: 0.4,
  },
});

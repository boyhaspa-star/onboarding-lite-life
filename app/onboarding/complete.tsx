import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, ArrowRight, User, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Easing,
  useAnimatedReaction,
} from 'react-native-reanimated';
import AILoader from '@/components/AILoader';
import { colors, typography, spacing } from '@/constants/theme';
import { ContinueButton, GlassCard } from '@/components';
import { completeOnboarding } from '@/store/onboarding$';

const profileSetupMessages = [
  'Setting up your profile...',
  'Analyzing your preferences...',
  'Creating workout recommendations...',
  'Personalizing your experience...',
  'Almost ready...',
];

export default function CompleteScreen() {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Merge onboarding data → profile (synced to Supabase)
    completeOnboarding();
    setIsSettingUp(true);
  };

  const handleSetupComplete = () => {
    router.replace('/(tabs)');
  };

  if (isSettingUp) {
    return (
      <SafeAreaView style={styles.loaderContainer} edges={['top', 'bottom']}>
        <AILoader
          title="Setting Up Your Profile"
          messages={profileSetupMessages}
          accentColor={colors.brand.primary}
          icon={<Sparkles size={48} color={colors.brand.primary} />}
          onComplete={handleSetupComplete}
          duration={3500}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.pageIndicator}>6 of 6</Text>
          </View>

          <View style={styles.celebrationSection}>
            <Animated.View
              style={[styles.checkmarkContainer, animatedStyle]}>
              <CheckCircle2 size={80} color={colors.brand.green} fill={colors.brand.green} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(600)}>
              <Text style={styles.celebrationTitle}>You're all set!</Text>
              <Text style={styles.celebrationSubtitle}>
                Your personalized workout plan is ready
              </Text>
            </Animated.View>
          </View>

          <Animated.View
            style={styles.benefitsSection}
            entering={FadeInUp.delay(500).duration(600)}>
            <View style={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <Text style={styles.benefitIconText}>💪</Text>
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Personalized Workouts</Text>
                <Text style={styles.benefitDescription}>
                  Tailored to your fitness level
                </Text>
              </View>
            </View>

            <View style={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <Text style={styles.benefitIconText}>📊</Text>
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Track Progress</Text>
                <Text style={styles.benefitDescription}>
                  Monitor your improvements
                </Text>
              </View>
            </View>

            <View style={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <Text style={styles.benefitIconText}>🎯</Text>
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Achieve Goals</Text>
                <Text style={styles.benefitDescription}>
                  Reach your fitness targets
                </Text>
              </View>
            </View>
          </Animated.View>

          <ContinueButton
            label="Let's Get Started"
            onPress={handleGetStarted}
            icon={<ArrowRight size={20} color={colors.text.primary} />}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.pure,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen.paddingHorizontalLg,
    paddingVertical: spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background.surface,
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.brand.green,
    borderRadius: 2,
  },
  pageIndicator: {
    color: colors.text.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  celebrationSection: {
    alignItems: 'center',
    marginBottom: spacing['5xl'],
  },
  checkmarkContainer: {
    marginBottom: spacing.xl,
  },
  celebrationTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  celebrationSubtitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.muted,
    textAlign: 'center',
  },
  benefitsSection: {
    marginBottom: 28,
    gap: 12,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.overlay.white3,
    borderWidth: 1,
    borderColor: colors.gray[1200],
    borderRadius: spacing.radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: spacing.radius.md,
    backgroundColor: colors.overlay.green15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitIconText: {
    fontSize: 24,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  benefitDescription: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.muted,
  },
});

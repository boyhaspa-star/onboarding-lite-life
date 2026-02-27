import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Sparkles, Shuffle, Brain, Zap, Target, Dumbbell } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { AnimatedBodyView } from '@/components';
import AILoader from '@/components/AILoader';
import { ScreenHeader, EmptyState } from '@/components';
import { colors, typography, spacing } from '@/constants/theme';
import { getWorkoutMeta } from '@/data/workouts';
import { useUserGender } from '@/hooks/useUserGender';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const loadingMessages = [
  'Analyzing your fitness profile...',
  'Optimizing exercise sequence...',
  'Balancing muscle groups...',
  'Customizing rest intervals...',
  'Preparing your best plan...',
];

export default function PreferenceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userGender = useUserGender();
  const workout = getWorkoutMeta(id || '1');
  
  const [isLoading, setIsLoading] = useState(false);

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon={<Dumbbell size={48} color={colors.brand.primary} />}
          title="Workout not found"
          subtitle="This workout may have been removed."
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const handleSmartPlan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
  };

  const handleManual = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/exercises/${id}?mode=manual`);
  };

  const handleSmartPlanComplete = () => {
    router.replace(`/exercises/plan/${id}`);
  };

  if (isLoading) {
    return (
      <AILoader
        title="Customizing Your Plan"
        messages={loadingMessages}
        icon={<Brain size={48} color={colors.brand.primary} />}
        onComplete={handleSmartPlanComplete}
        duration={3000}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <ScreenHeader title={workout.title} subtitle={workout.subtitle} />

      {/* Body Preview */}
      <View style={styles.bodyPreview}>
        <AnimatedBodyView
          data={workout.targetMuscles}
          gender={userGender}
          side={workout.bodySide}
          scale={0.7}
          colors={[colors.brand.primary, colors.brand.primary]}
        />
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>How would you like</Text>
        <Text style={styles.mainTitle}>to train today?</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {/* Smart Plan Option */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleSmartPlan}
          activeOpacity={0.9}>
          <View style={styles.optionCardBorder}>
            <Svg width="100%" height="100%" viewBox="0 0 343 140" preserveAspectRatio="none">
              <Defs>
                <LinearGradient id="smartBorder" x1="0" y1="0" x2="343" y2="140">
                  <Stop offset="0" stopColor={colors.brand.primary} stopOpacity="0.6" />
                  <Stop offset="1" stopColor={colors.brand.primary} stopOpacity="0.1" />
                </LinearGradient>
              </Defs>
              <Path
                d="M16 0C7.163 0 0 7.163 0 16V124C0 132.837 7.163 140 16 140H327C335.837 140 343 132.837 343 124V16C343 7.163 335.837 0 327 0H16Z"
                fill={colors.overlay.accent8}
                stroke="url(#smartBorder)"
                strokeWidth="1.5"
              />
            </Svg>
          </View>

          <View style={styles.optionContent}>
            <View style={styles.optionIconContainer}>
              <View style={styles.optionIconBg}>
                <Sparkles size={28} color={colors.brand.primary} />
              </View>
            </View>
            <View style={styles.optionTextArea}>
              <View style={styles.optionTitleRow}>
                <Text style={styles.optionTitle}>Smart Plan</Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Recommended</Text>
                </View>
              </View>
              <Text style={styles.optionDescription}>
                AI-optimized sequence based on your fitness level and goals
              </Text>
              <View style={styles.optionFeatures}>
                <View style={styles.featureItem}>
                  <Target size={12} color={colors.brand.primary} />
                  <Text style={styles.featureText}>Personalized</Text>
                </View>
                <View style={styles.featureItem}>
                  <Zap size={12} color={colors.brand.primary} />
                  <Text style={styles.featureText}>Optimized</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Manual Option */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleManual}
          activeOpacity={0.9}>
          <View style={styles.optionCardBorder}>
            <Svg width="100%" height="100%" viewBox="0 0 343 140" preserveAspectRatio="none">
              <Defs>
                <LinearGradient id="manualBorder" x1="0" y1="0" x2="343" y2="140">
                  <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.3" />
                  <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.05" />
                </LinearGradient>
              </Defs>
              <Path
                d="M16 0C7.163 0 0 7.163 0 16V124C0 132.837 7.163 140 16 140H327C335.837 140 343 132.837 343 124V16C343 7.163 335.837 0 327 0H16Z"
                fill={colors.overlay.white3}
                stroke="url(#manualBorder)"
                strokeWidth="1"
              />
            </Svg>
          </View>

          <View style={styles.optionContent}>
            <View style={styles.optionIconContainer}>
              <View style={[styles.optionIconBg, styles.optionIconBgManual]}>
                <Shuffle size={28} color={colors.text.subtle} />
              </View>
            </View>
            <View style={styles.optionTextArea}>
              <Text style={[styles.optionTitle, styles.optionTitleManual]}>Manual Mode</Text>
              <Text style={styles.optionDescription}>
                Browse all exercises and pick your own workout flow
              </Text>
              <View style={styles.optionFeatures}>
                <View style={styles.featureItem}>
                  <Dumbbell size={12} color={colors.text.disabled} />
                  <Text style={[styles.featureText, styles.featureTextManual]}>Full Control</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Body Preview
  bodyPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 10,
  },
  // Title
  titleSection: {
    paddingHorizontal: spacing.screen.paddingHorizontal,
    marginBottom: spacing['2xl'],
  },
  mainTitle: {
    fontSize: typography.fontSize['5xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
    textAlign: 'center',
  },
  // Options
  optionsContainer: {
    paddingHorizontal: spacing.screen.paddingHorizontal,
    gap: spacing.lg,
  },
  optionCard: {
    height: 140,
    borderRadius: spacing.radius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  optionCardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  optionIconContainer: {
    justifyContent: 'center',
  },
  optionIconBg: {
    width: spacing.iconContainerLg,
    height: spacing.iconContainerLg,
    borderRadius: spacing.radius['3xl'],
    backgroundColor: colors.overlay.accent15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIconBgManual: {
    backgroundColor: colors.overlay.white8,
  },
  optionTextArea: {
    flex: 1,
    justifyContent: 'center',
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  optionTitle: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.brand.primary,
  },
  optionTitleManual: {
    color: colors.text.primary,
    marginBottom: 6,
  },
  recommendedBadge: {
    backgroundColor: colors.overlay.accent20,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: spacing.radius.xs,
  },
  recommendedText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.brand.primary,
    textTransform: 'uppercase',
  },
  optionDescription: {
    fontSize: typography.fontSize.base,
    color: colors.text.subtle,
    lineHeight: typography.lineHeight.normal,
    marginBottom: 10,
  },
  optionFeatures: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureText: {
    fontSize: typography.fontSize.sm,
    color: colors.brand.primary,
    fontWeight: typography.fontWeight.medium,
  },
  featureTextManual: {
    color: colors.text.disabled,
  },
});

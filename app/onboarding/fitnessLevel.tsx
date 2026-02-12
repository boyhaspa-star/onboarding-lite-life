import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '@/constants/theme';
import { ProgressDots, ContinueButton, GlassCard } from '@/components';
import { onboarding$ } from '@/store/onboarding$';

type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | null;

const fitnessLevels = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: "I'm new to fitness",
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'I work out from time to time',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'I exercise regularly',
  },
];

export default function FitnessLevelScreen() {
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel>(null);
  
  // Animation refs for each card
  const scaleAnims = useRef(
    fitnessLevels.map(() => new Animated.Value(1))
  ).current;

  const handlePressIn = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handleSelect = (id: string, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLevel(id as FitnessLevel);
  };

  const handleContinue = () => {
    if (selectedLevel) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onboarding$.fitnessLevel.set(selectedLevel as any);
      router.push('/onboarding/bodyParts');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Progress dots — shared component */}
        <ProgressDots total={4} active={3} />

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>What's your</Text>
          <Text style={styles.titleAccent}>fitness level?</Text>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          {fitnessLevels.map((level, index) => {
            const isSelected = selectedLevel === level.id;

            return (
              <Animated.View
                key={level.id}
                style={[
                  { transform: [{ scale: scaleAnims[index] }] },
                ]}
              >
                <Pressable
                  onPressIn={() => handlePressIn(index)}
                  onPressOut={() => handlePressOut(index)}
                  onPress={() => handleSelect(level.id, index)}
                  style={[
                    styles.card,
                    isSelected && styles.cardSelected,
                  ]}
                >
                  <Text style={styles.cardTitle}>{level.title}</Text>
                  <Text style={styles.cardDescription}>{level.description}</Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Bottom Button — shared component */}
        <View style={styles.bottomSection}>
          <ContinueButton
            label="Next"
            onPress={handleContinue}
            disabled={!selectedLevel}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen.paddingHorizontalLg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  titleSection: {
    marginBottom: spacing['3xl'],
  },
  title: {
    fontSize: typography.fontSize['6xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
  },
  titleAccent: {
    fontSize: typography.fontSize['6xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.brand.cta,
  },
  cardsContainer: {
    flex: 1,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.overlay.dark50,
    borderRadius: spacing.radius.xl,
    padding: spacing['2xl'],
    minHeight: 110,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.overlay.white10,
  },
  cardSelected: {
    borderColor: colors.brand.primary,
    borderWidth: 2,
    backgroundColor: colors.overlay.accent5,
  },
  cardTitle: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.body,
    color: colors.overlay.white60,
  },
  bottomSection: {
    marginTop: spacing['2xl'],
  },
});

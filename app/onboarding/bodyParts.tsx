import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import BodyView from 'react-native-body-highlighter';
import { colors, typography, spacing } from '@/constants/theme';
import { ProgressDots, ContinueButton } from '@/components';
import { muscleGroups, getHighlightedPartsFromSelection } from '@/data/muscles';
import { onboarding$ } from '@/store/onboarding$';

type MuscleGroup = typeof muscleGroups[number];

export default function BodyPartsScreen() {
  const [selectedMuscles, setSelectedMuscles] = useState<Set<string>>(new Set());
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');

  const toggleMuscle = (id: string) => {
    const newSelected = new Set(selectedMuscles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMuscles(newSelected);
  };

  const toggleView = () => {
    setViewSide((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const getHighlightedParts = () => {
    return getHighlightedPartsFromSelection(selectedMuscles);
  };

  const groupedMuscles = {
    upper: muscleGroups.filter((m) => m.category === 'upper' && (m.side === viewSide || m.side === 'both')),
    core: muscleGroups.filter((m) => m.category === 'core' && (m.side === viewSide || m.side === 'both')),
    lower: muscleGroups.filter((m) => m.category === 'lower' && (m.side === viewSide || m.side === 'both')),
  };

  const handleContinue = () => {
    if (selectedMuscles.size > 0) {
      onboarding$.targetMuscleGroups.set(Array.from(selectedMuscles));
      router.push('/onboarding/week');
    }
  };

  const renderMuscleButton = (muscle: MuscleGroup) => (
    <TouchableOpacity
      key={muscle.id}
      style={[
        styles.muscleButton,
        selectedMuscles.has(muscle.id) && styles.muscleButtonSelected,
      ]}
      onPress={() => toggleMuscle(muscle.id)}
      activeOpacity={0.7}>
      <View
        style={[
          styles.checkbox,
          selectedMuscles.has(muscle.id) && styles.checkboxSelected,
        ]}>
        {selectedMuscles.has(muscle.id) && (
          <Check size={12} color={colors.text.inverse} strokeWidth={3} />
        )}
      </View>
      <Text
        style={[
          styles.muscleText,
          selectedMuscles.has(muscle.id) && styles.muscleTextSelected,
        ]}>
        {muscle.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.mainContainer}>
        {/* Progress dots — shared component */}
        <ProgressDots total={4} active={4} />

        <View style={styles.titleSection}>
          <Text style={styles.title}>Target</Text>
          <Text style={styles.titleAccent}>muscle groups</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.leftPanel}>
            <ScrollView style={styles.muscleList} showsVerticalScrollIndicator={false}>
              <View style={styles.categorySection}>
                <Text style={styles.categoryTitle}>UPPER BODY</Text>
                {groupedMuscles.upper.map(renderMuscleButton)}
              </View>

              <View style={styles.categorySection}>
                <Text style={styles.categoryTitle}>CORE</Text>
                {groupedMuscles.core.map(renderMuscleButton)}
              </View>

              <View style={styles.categorySection}>
                <Text style={styles.categoryTitle}>LOWER BODY</Text>
                {groupedMuscles.lower.map(renderMuscleButton)}
              </View>
            </ScrollView>
          </View>

          <View style={styles.rightPanel}>
            <View style={styles.bodyViewContainer}>
              <BodyView
                data={getHighlightedParts()}
                gender="male"
                side={viewSide}
                scale={1.2}
                colors={[colors.brand.green, colors.brand.primaryAlt]}
              />
            </View>

            <TouchableOpacity
              style={styles.rotateButton}
              onPress={toggleView}
              activeOpacity={0.7}>
              <Text style={styles.rotateEmoji}>🔄</Text>
              <Text style={styles.rotateText}>
                {viewSide === 'front' ? 'Back' : 'Front'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.selectionCount}>
            {selectedMuscles.size} {selectedMuscles.size === 1 ? 'area' : 'areas'} selected
          </Text>
          <ContinueButton
            label="Next"
            onPress={handleContinue}
            disabled={selectedMuscles.size === 0}
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
  mainContainer: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: spacing.screen.paddingHorizontal,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['5xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
  },
  titleAccent: {
    fontSize: typography.fontSize['5xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.brand.cta,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  leftPanel: {
    flex: 1,
  },
  muscleList: {
    flex: 1,
  },
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryTitle: {
    color: colors.text.disabled,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bodyBold,
    letterSpacing: 1,
    marginBottom: spacing.xs + 2,
    marginLeft: spacing.xs,
  },
  muscleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: spacing.radius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs + 2,
  },
  muscleButtonSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.overlay.accent10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.gray[900],
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  muscleText: {
    color: colors.gray[200],
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.body,
  },
  muscleTextSelected: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bodyBold,
  },
  rightPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bodyViewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateButton: {
    position: 'absolute',
    bottom: spacing.sm,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.overlay.accent15,
    borderWidth: 1,
    borderColor: colors.brand.primary,
    borderRadius: spacing.radius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg - 2,
    gap: spacing.xs + 2,
  },
  rotateEmoji: {
    fontSize: typography.fontSize.lg,
  },
  rotateText: {
    color: colors.brand.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bodyBold,
  },
  buttonContainer: {
    paddingHorizontal: spacing.screen.paddingHorizontal,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  selectionCount: {
    color: colors.text.muted,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.body,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});

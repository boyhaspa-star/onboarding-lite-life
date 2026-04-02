import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { colors, typography, spacing } from '@/constants/theme';
import { AnimatedBodyView } from '@/components';
import { workoutPrograms, workoutCategoryFilters } from '@/data/workouts';
import { ProgressRing, CategoryPills } from '@/components';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { FadeInView } from '@/components/FadeInView';
import { useUserGender } from '@/hooks/useUserGender';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WorkoutScreen() {
  const userGender = useUserGender();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredWorkouts = selectedCategory === 'all' 
    ? workoutPrograms 
    : workoutPrograms.filter(w => w.category === selectedCategory);

  const navigateToWorkout = (workoutId: string) => {
    router.push(`/exercises/preference/${workoutId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Workouts</Text>
          <Text style={styles.pageSubtitle}>{workoutPrograms.length} programs available</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Bell size={22} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <CategoryPills
        categories={workoutCategoryFilters}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Workout Cards */}
      <ScrollView 
        style={styles.workoutList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.workoutListContent}
      >
        {filteredWorkouts.map((workout, index) => (
          <FadeInView key={workout.id} index={index}>
          <AnimatedPressable
            style={styles.workoutCard}
            onPress={() => navigateToWorkout(workout.id)}
          >
            {/* Card Background */}
            <View style={styles.cardBackground}>
              <Svg width="100%" height="100%" viewBox="0 0 343 160" preserveAspectRatio="none">
                <Defs>
                  <LinearGradient id={`cardGrad-${index}`} x1="0" y1="0" x2="343" y2="160" gradientUnits="userSpaceOnUse">
                    <Stop offset="0" stopColor="#1A1A1A" stopOpacity="1" />
                    <Stop offset="1" stopColor="#141414" stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                {/* L-shape */}
                <Path 
                  d="M16 0C7.163 0 0 7.163 0 16V115H145C153.837 115 162 123.163 162 132V144C162 152.837 169.163 160 178 160H327C335.837 160 343 152.837 343 144V16C343 7.163 335.837 0 327 0H16Z" 
                  fill={`url(#cardGrad-${index})`}
                  stroke={colors.border.muted}
                  strokeWidth="1"
                />
              </Svg>
            </View>

            {/* Body Skeleton + Progress Ring Container */}
            <View style={styles.bodyAndProgressContainer}>
              <View style={styles.bodySkeletonContainer}>
                <AnimatedBodyView
                  data={workout.targetMuscles}
                  gender={userGender}
                  side={workout.bodySide}
                  scale={0.38}
                  colors={['#86efac', '#E6FE58']}
                />
              </View>
              
              {/* Progress Ring */}
              <View style={styles.progressRing}>
                <ProgressRing
                  percentage={workout.progress}
                  size={52}
                  strokeWidth={4}
                  trackColor={colors.background.muted}
                />
              </View>
            </View>

            {/* Card Content */}
            <View style={styles.cardContent}>
              {/* Title & Meta */}
              <View style={styles.cardHeader}>
                <View style={styles.titleArea}>
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                  <Text style={styles.workoutSubtitle}>{workout.subtitle}</Text>
                </View>
              </View>

              {/* Meta Info */}
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaValue}>{workout.duration}</Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <Text style={styles.metaValue}>{workout.exerciseCount} exercises</Text>
                </View>
              </View>
            </View>

            {/* Start Button */}
            <TouchableOpacity
              style={styles.startButton}
              activeOpacity={0.85}
              onPress={() => navigateToWorkout(workout.id)}>
              <Text style={styles.startButtonText}>
                {workout.progress > 0 ? 'Continue' : 'Start'}
              </Text>
            </TouchableOpacity>
          </AnimatedPressable>
          </FadeInView>
        ))}
        
        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screen.paddingHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  pageTitle: {
    fontSize: typography.fontSize['5xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  pageSubtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.disabled,
  },
  iconButton: {
    width: spacing.iconButton,
    height: spacing.iconButton,
    borderRadius: spacing.iconButtonRadius,
    backgroundColor: colors.overlay.white8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Workout List
  workoutList: {
    flex: 1,
  },
  workoutListContent: {
    paddingHorizontal: spacing.screen.paddingHorizontal,
    gap: spacing.lg,
  },
  // Workout Card
  workoutCard: {
    height: 160,
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bodyAndProgressContainer: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bodySkeletonContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.95,
  },
  progressRing: {
    marginRight: 5,
  },
  cardContent: {
    flex: 1,
    padding: 18,
    paddingBottom: 55,
    paddingRight: 140,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  titleArea: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 22,
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  workoutSubtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.subtle,
    fontWeight: typography.fontWeight.medium,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaValue: {
    fontSize: typography.fontSize.base,
    color: colors.text.disabled,
    fontWeight: typography.fontWeight.medium,
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[1200],
    marginHorizontal: 10,
  },
  // Start Button
  startButton: {
    position: 'absolute',
    bottom: 1,
    left: 1,
    backgroundColor: colors.brand.cta,
    borderTopRightRadius: spacing.radius.lg,
    borderBottomLeftRadius: spacing.radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing['5xl'],
    minWidth: 162,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
  },
});

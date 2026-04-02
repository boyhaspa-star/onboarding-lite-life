import { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import { Settings, Play, Clock, Flame, ChevronLeft, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '@/constants/theme';
import { getWorkoutById } from '@/data/workouts';


import { ProgressRing, AnimatedBodyView } from '@/components';
import { FadeInView } from '@/components/FadeInView';
import { useUserGender } from '@/hooks/useUserGender';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Week Day Helper ────────────────────────────────────

function getWeekDays() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const shortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Show 5 days centered around today
  const days = [];
  for (let i = -1; i <= 3; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    days.push({
      id: dayNames[d.getDay()].toLowerCase(),
      label: shortNames[d.getDay()].toUpperCase(),
      date: d.getDate(),
      isToday: i === 0,
    });
  }
  return { days, todayLabel: dayNames[dayOfWeek] };
}

// ─── Plan Screen ────────────────────────────────────────

export default function WorkoutPlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userGender = useUserGender();
  const workout = getWorkoutById(id || '1');

  const { days, todayLabel } = useMemo(() => getWeekDays(), []);

  if (!workout) {
    router.back();
    return null;
  }

  // First 3 exercises for "
  // " section
  const upcomingExercises = workout.exercises.slice(0, 3);
  const totalMinutes = workout.duration;
  
  const kcalPerExercise = Math.round(workout.calories / workout.exercises.length);

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/exercises/mode/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Top Meta ── */}
        <FadeInView index={0} delay={100}>
          <Text style={styles.topMeta}>{totalMinutes}</Text>
        </FadeInView>

        {/* ── Header Row ── */}
        <FadeInView index={0} delay={200}>
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>Workout Plan</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.headerIconBtn}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <ChevronLeft size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.headerIconBtn, styles.headerIconBtnActive]}
                onPress={handleSettings}
                activeOpacity={0.7}
              >
                <Settings size={18} color={colors.brand.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </FadeInView>

        {/* ── Week Calendar Strip ── */}
        <FadeInView index={1} delay={250}>
          <View style={styles.weekRow}>
            {/* Today Badge */}
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>{todayLabel}</Text>
            </View>
            <View style={styles.todayLabelWrap}>
              <Text style={styles.todayLabelText}>Time to Workout</Text>
            </View>

            {/* Day columns */}
            <View style={styles.daysContainer}>
              {days.map((day) => (
                <View
                  key={day.id}
                  style={[styles.dayCol, day.isToday && styles.dayColActive]}
                >
                  <Text style={styles.dayDate}>{day.date}</Text>
                  <Text style={styles.dayLabel}>{day.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </FadeInView>

        {/* ── Main Workout Card ── */}
        <FadeInView index={2} delay={350}>
          <View style={styles.mainCard}>
            {/* Glass background */}
            <View style={styles.mainCardBg}>
              <Svg width="100%" height="100%" viewBox="0 0 343 200" preserveAspectRatio="none">
                <Defs>
                  <LinearGradient id="planCardGrad" x1="0" y1="0" x2="343" y2="200" gradientUnits="userSpaceOnUse">
                    <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.08" />
                    <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.02" />
                  </LinearGradient>
                  <LinearGradient id="planCardBorder" x1="0" y1="0" x2="343" y2="200" gradientUnits="userSpaceOnUse">
                    <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.25" />
                    <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.05" />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="343" height="200" rx="20" fill="url(#planCardGrad)" />
                <Rect x="0.5" y="0.5" width="342" height="199" rx="19.5" stroke="url(#planCardBorder)" strokeWidth="1" fill="none" />
              </Svg>
            </View>

            {/* Body silhouette on right */}
            <View style={styles.mainCardBody}>
              <AnimatedBodyView
                data={workout.targetMuscles}
                gender={userGender}
                side={workout.bodySide}
                scale={0.42}
                colors={[colors.brand.primary, colors.brand.primaryAlt]}
              />
            </View>

            {/* Card content */}
            <View style={styles.mainCardContent}>
              <Text style={styles.mainCardTitle}>
                {workout.title.toUpperCase()} {'&\n'}
                {workout.subtitle.toUpperCase()} PLAN
              </Text>
              <Text style={styles.mainCardSub}>
                {workout.exercises[0]?.name || 'Dynamic Warmup'} | {totalMinutes}
              </Text>
            </View>

            {/* Progress ring bottom-right */}
            <View style={styles.mainCardRing}>
              <ProgressRing
                percentage={workout.progress}
                size={48}
                strokeWidth={4}
                trackColor={colors.background.muted}
              />
            </View>
          </View>
        </FadeInView>

        {/* ── Next Exercise Section ── */}
        <FadeInView index={3} delay={450}>
          <Text style={styles.sectionTitle}>Next Exercise</Text>
        </FadeInView>

        {upcomingExercises.map((exercise, index) => {
          const isFirst = index === 0;
          const isLast = index === upcomingExercises.length - 1;
          return (
          <FadeInView key={exercise.id} index={index + 4} delay={500}>
            <View style={styles.exerciseRow}>
              {/* Timeline */}
              <View style={styles.timelineCol}>
                {/* Status circle */}
                <View style={[
                  styles.timelineDot,
                  isFirst && styles.timelineDotCompleted,
                ]}>
                  {isFirst && <Check size={14} color={colors.text.inverse} strokeWidth={3} />}
                </View>
                {/* Connecting line */}
                {!isLast && (
                  <View style={[
                    styles.timelineLine,
                    isFirst ? styles.timelineLineSolid : styles.timelineLineDashed,
                  ]} />
                )}
              </View>

              {/* Exercise Card */}
              <View style={styles.exerciseCard}>
                {/* Thumbnail with body silhouette */}
                <View style={styles.exerciseThumb}>
                  <AnimatedBodyView
                    data={exercise.targetMuscles}
                    gender={userGender}
                    side={exercise.bodySide}
                    scale={0.22}
                    colors={[colors.gray[600], colors.gray[500]]}
                  />
                </View>

                {/* Text content */}
                <View style={styles.exerciseCardContent}>
                  <View style={styles.exerciseNameRow}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    {exercise.reps && (
                      <Text style={styles.exerciseMetric}>{exercise.reps}</Text>
                    )}
                  </View>
                  <View style={styles.exerciseDetailRow}>
                    <Flame size={14} color={colors.gray[700]} />
                    <Text style={styles.exerciseDetailText}>{kcalPerExercise} kcal</Text>
                  </View>
                  <View style={styles.exerciseDetailRow}>
                    <Clock size={14} color={colors.gray[700]} />
                    <Text style={styles.exerciseDetailText}>{exercise.duration}</Text>
                  </View>
                </View>
              </View>
            </View>
          </FadeInView>
          );
        })}

        {/* Bottom spacer for button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Start Exercise Button ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.85}
        >
          <Play size={20} color={colors.text.primary} fill={colors.text.primary} />
          <Text style={styles.startButtonText}>Start Exercise</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screen.paddingHorizontal,
  },

  // Top Meta
  topMeta: {
    fontSize: typography.fontSize.lg,
    color: colors.text.disabled,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  pageTitle: {
    fontSize: typography.fontSize['5xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerIconBtn: {
    width: spacing.iconButton,
    height: spacing.iconButton,
    borderRadius: spacing.iconButtonRadius,
    backgroundColor: colors.overlay.white8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconBtnActive: {
    backgroundColor: colors.overlay.accent15,
    borderWidth: 1,
    borderColor: colors.overlay.accent20,
  },

  // Week Row
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  todayBadge: {
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.xs,
  },
  todayBadgeText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.inverse,
    textTransform: 'uppercase',
  },
  todayLabelWrap: {
    flex: 1,
  },
  todayLabelText: {
    fontSize: typography.fontSize.base,
    color: colors.text.subtle,
    fontWeight: typography.fontWeight.medium,
  },
  daysContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dayCol: {
    alignItems: 'center',
    gap: 2,
  },
  dayColActive: {
    opacity: 1,
  },
  dayDate: {
    fontSize: typography.fontSize.xl,
    color: colors.text.muted,
    fontWeight: typography.fontWeight.semiBold,
  },
  dayLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.disabled,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
  },

  // Main Card
  mainCard: {
    height: 200,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing['3xl'],
  },
  mainCardBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mainCardBody: {
    position: 'absolute',
    right: 30,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  mainCardContent: {
    flex: 1,
    padding: spacing.xl,
    paddingRight: 120,
    justifyContent: 'center',
  },
  mainCardTitle: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
    lineHeight: 28,
    marginBottom: spacing.sm,
  },
  mainCardSub: {
    fontSize: typography.fontSize.lg,
    color: colors.text.subtle,
    fontWeight: typography.fontWeight.medium,
  },
  mainCardRing: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },

  // Section Title
  sectionTitle: {
    fontSize: typography.fontSize['4xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },

  // Timeline
  timelineCol: {
    alignItems: 'center',
    width: 32,
    paddingTop: spacing.lg,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.gray[700],
    backgroundColor: colors.gray[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotCompleted: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.brand.primary,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginTop: 6,
    marginBottom: -6,
  },
  timelineLineSolid: {
    backgroundColor: colors.brand.primary,
  },
  timelineLineDashed: {
    borderLeftWidth: 2,
    borderLeftColor: colors.gray[1100],
    borderStyle: 'dashed',
    width: 0,
  },

  // Exercise Row
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  exerciseCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  exerciseThumb: {
    width: 90,
    height: 90,
    borderRadius: spacing.radius.md,
    backgroundColor: colors.background.muted,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  exerciseCardContent: {
    flex: 1,
    gap: 6,
  },
  exerciseNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
    flex: 1,
  },
  exerciseMetric: {
    fontSize: typography.fontSize.lg,
    color: colors.text.muted,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.sm,
  },
  exerciseDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseDetailText: {
    fontSize: typography.fontSize.lg,
    color: colors.gray[600],
    fontWeight: typography.fontWeight.medium,
  },

  // Bottom Bar
  bottomBar: {
    paddingHorizontal: spacing.screen.paddingHorizontal,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    backgroundColor: colors.background.primary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.brand.cta,
    borderRadius: spacing.radius['3xl'],
    paddingVertical: spacing.lg,
  },
  startButtonText: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
  },
});

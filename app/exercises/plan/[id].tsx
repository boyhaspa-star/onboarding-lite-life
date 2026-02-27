import { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import { Settings, Play, Clock, Flame, ChevronLeft } from 'lucide-react-native';
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

  // First 3 exercises for "Next Exercise" section
  const upcomingExercises = workout.exercises.slice(0, 3);
  const totalMinutes = workout.duration;

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

        {upcomingExercises.map((exercise, index) => (
          <FadeInView key={exercise.id} index={index + 4} delay={500}>
            <View style={styles.exerciseRow}>
              {/* Numbered circle */}
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
              </View>

              {/* Exercise details */}
              <View style={styles.exerciseCard}>
                <View style={styles.exerciseCardBg}>
                  <Svg width="100%" height="100%" preserveAspectRatio="none">
                    <Defs>
                      <LinearGradient id={`exGrad-${index}`} x1="0" y1="0" x2="300" y2="100" gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.06" />
                        <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.02" />
                      </LinearGradient>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" rx="16" fill={`url(#exGrad-${index})`} />
                    <Rect x="0.5" y="0.5" width="99%" height="99%" rx="15.5" stroke={colors.border.subtle} strokeWidth="1" fill="none" />
                  </Svg>
                </View>

                <View style={styles.exerciseCardInner}>
                  <View style={styles.exerciseCardContent}>
                    <View style={styles.exerciseTop}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseMeta}>
                        {exercise.reps ? `${exercise.reps} · ` : ''}{exercise.duration}
                      </Text>
                    </View>
                    <Text style={styles.exerciseDesc}>
                      {getExerciseDescription(exercise.name)}
                    </Text>
                  </View>

                  {/* Exercise character visual */}
                  <View style={styles.exerciseVisual}>
                    <AnimatedBodyView
                      data={exercise.targetMuscles}
                      gender={userGender}
                      side={exercise.bodySide}
                      scale={0.22}
                      colors={[colors.brand.primary, colors.brand.primaryAlt]}
                    />
                  </View>
                </View>
              </View>
            </View>
          </FadeInView>
        ))}

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

// ─── Exercise Descriptions ──────────────────────────────

function getExerciseDescription(name: string): string {
  const descriptions: Record<string, string> = {
    'Warm Up Jog': 'Light jogging to increase heart rate and prepare muscles for the workout ahead.',
    'Push Ups': 'Strengthening your chest, shoulders and triceps with controlled bodyweight movements.',
    'Squats': 'Building lower body power by targeting quads, glutes and hamstrings effectively.',
    'Plank Hold': 'Strengthening your core will help you to move more easily during everyday activities.',
    'Lunges': 'Improving balance and strength through unilateral leg movements.',
    'Burpees': 'Full-body cardio exercise combining squat, plank, and jump for maximum calorie burn.',
    'Mountain Climbers': 'Dynamic core workout that builds endurance and strengthens hip flexors.',
    'Jumping Jacks': 'Classic warm-up exercise to elevate heart rate and warm up the entire body.',
    'Tricep Dips': 'Targeting the back of the arms with a focused bodyweight pressing movement.',
    'Cool Down Stretch': 'Gentle stretching to improve flexibility and aid in muscle recovery.',
    'Arm Circles': 'Warming up shoulder joints and improving mobility before upper body work.',
    'Diamond Push Ups': 'Narrower hand placement shifts focus to triceps for greater arm definition.',
    'Bicep Curls': 'Isolating the biceps for focused arm strengthening and development.',
    'Wide Push Ups': 'Wider hand position emphasizes chest engagement for a broader pump.',
    'Shoulder Taps': 'Building core stability while strengthening shoulders through anti-rotation work.',
    'High Knees': 'Explosive cardio movement that targets quads and improves running mechanics.',
    'Box Jumps': 'Plyometric exercise building explosive power in the lower body.',
    'Sprint Intervals': 'Interval training is beneficial for both aerobic and anaerobic energy systems.',
    'Leg Swings': 'Dynamic stretching for hip mobility and hamstring flexibility.',
    'Goblet Squats': 'Front-loaded squat variation that improves depth and core engagement.',
    'Walking Lunges': 'Combining movement with strength for functional lower body training.',
    'Calf Raises': 'Isolated calf work to build ankle stability and lower leg strength.',
    'Glute Bridges': 'Activating and strengthening the glutes while protecting the lower back.',
    'Wall Sit': 'Isometric hold building endurance and strength in the quadriceps.',
  };
  return descriptions[name] || 'Strengthening your body through controlled, effective movements.';
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

  // Exercise Row
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  exerciseNumberText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.brand.primary,
  },
  exerciseCard: {
    flex: 1,
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 100,
  },
  exerciseCardBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  exerciseCardContent: {
    paddingVertical: spacing.md,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    flex: 1,
  },
  exerciseCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseVisual: {
    width: 65,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    opacity: 0.6,
  },
  exerciseTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  exerciseName: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
  },
  exerciseMeta: {
    fontSize: typography.fontSize.base,
    color: colors.text.disabled,
    fontWeight: typography.fontWeight.medium,
  },
  exerciseDesc: {
    fontSize: typography.fontSize.base,
    color: colors.text.subtle,
    lineHeight: typography.lineHeight.relaxed,
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

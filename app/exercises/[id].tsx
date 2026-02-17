import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Play, Clock, Dumbbell, Check, Search, Sparkles, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BodyView from 'react-native-body-highlighter';
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '@/constants/theme';
import { getWorkoutById, exerciseCategoryFilters } from '@/data/workouts';
import { CategoryPills, ScreenHeader, EmptyState } from '@/components';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { FadeInView } from '@/components/FadeInView';
import { useUserGender } from '@/hooks/useUserGender';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 14;
const CARD_WIDTH = (SCREEN_WIDTH - 40 - CARD_GAP) / 2;

export default function ExercisesScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const userGender = useUserGender();
  const workout = getWorkoutById(id || '1');
  const isSmartMode = mode === 'smart';
  
  // State - simplified
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  // Get exercises based on mode
  const baseExercises = useMemo(() => {
    if (!workout) return [];
    
    if (isSmartMode) {
      // Smart mode: Show recommended first, then others
      const recommended = workout.exercises.filter(e => e.isRecommended);
      const others = workout.exercises.filter(e => !e.isRecommended);
      return [...recommended, ...others];
    } else {
      // Manual mode: Shuffle exercises randomly
      return [...workout.exercises].sort(() => Math.random() - 0.5);
    }
  }, [workout, isSmartMode]);

  // Filter exercises based on search and category
  const filteredExercises = useMemo(() => {
    return baseExercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           exercise.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [baseExercises, searchQuery, selectedCategory]);

  // Calculate stats based on mode
  const smartExercises = isSmartMode ? baseExercises.filter(e => e.isRecommended) : baseExercises;
  const totalCount = smartExercises.length;
  const completedCount = [...completedExercises].filter(id => 
    smartExercises.some(e => e.id === id)
  ).length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Calculate total duration
  const totalDuration = useMemo(() => {
    const totalMinutes = smartExercises.reduce((acc, e) => {
      const mins = parseInt(e.duration) || 0;
      return acc + mins;
    }, 0);
    return `${totalMinutes} min`;
  }, [smartExercises]);

  const toggleExerciseCompleted = (exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon={<Search size={48} color={colors.brand.primary} />}
          title="Workout not found"
          subtitle="This workout may have been removed or doesn't exist."
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <ScreenHeader
        title={workout.title}
        subtitle={workout.subtitle}
        titleRight={
          isSmartMode ? (
            <View style={styles.modeBadge}>
              <Sparkles size={10} color={colors.text.inverse} />
              <Text style={styles.modeBadgeText}>Smart</Text>
            </View>
          ) : undefined
        }
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.text.disabled} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={colors.text.disabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={colors.text.disabled} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills */}
      <CategoryPills
        categories={exerciseCategoryFilters}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          <Text style={styles.statsHighlight}>{completedCount}/{totalCount}</Text> completed  •  {totalDuration}
        </Text>
        {progress > 0 && (
          <Text style={styles.progressBadge}>{progress}%</Text>
        )}
      </View>

      {/* Exercise Grid */}
      <ScrollView 
        style={styles.exerciseList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      >
        {filteredExercises.map((exercise, index) => {
          const isCompleted = completedExercises.has(exercise.id);
          
          return (
            <FadeInView key={exercise.id} index={index} stagger={60}>
            <AnimatedPressable
              style={[
                styles.gridCard,
                index % 2 === 0 ? styles.gridCardLeft : styles.gridCardRight,
              ]}
              onPress={() => toggleExerciseCompleted(exercise.id)}
            >
              {/* Card Border */}
              <View style={styles.cardBorder}>
                <Svg width="100%" height="100%" viewBox={`0 0 ${CARD_WIDTH} ${CARD_WIDTH * 1.25}`} preserveAspectRatio="none">
                  <Defs>
                    <SvgLinearGradient id={`cardBorder-${exercise.id}`} x1="0" y1="0" x2={CARD_WIDTH} y2={CARD_WIDTH * 1.25} gradientUnits="userSpaceOnUse">
                      <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.3" />
                      <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.05" />
                    </SvgLinearGradient>
                  </Defs>
                  <Rect x="0.5" y="0.5" width={CARD_WIDTH - 1} height={CARD_WIDTH * 1.25 - 1} rx="19.5" stroke={`url(#cardBorder-${exercise.id})`} strokeWidth="1" fill="none" />
                </Svg>
              </View>
              
              {/* Body Skeleton */}
              <View style={styles.cardImageContainer}>
                <BodyView
                  data={exercise.targetMuscles}
                  gender={userGender}
                  side={exercise.bodySide}
                  scale={0.32}
                  colors={['#F5A962', '#E9A45C']}
                />
              </View>
              
              {/* Gradient Overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.85)']}
                style={styles.cardGradient}
              />

              {/* Recommended Badge */}
              {exercise.isRecommended && !isSmartMode && (
                <View style={styles.recommendedBadge}>
                  <Sparkles size={10} color={colors.text.inverse} />
                </View>
              )}

              {/* Sequence Number (Smart Plan mode) */}
              {isSmartMode && !isCompleted && (
                <View style={styles.sequenceBadge}>
                  <Text style={styles.sequenceText}>{index + 1}</Text>
                </View>
              )}
              
              {/* Completed Overlay */}
              {isCompleted && (
                <View style={styles.completedOverlay}>
                  <View style={styles.checkCircle}>
                    <Check size={20} color={colors.text.inverse} />
                  </View>
                </View>
              )}

              {/* Play Button (only in manual mode for non-completed) */}
              {!isCompleted && !isSmartMode && (
                <View style={styles.playButtonWrapper}>
                  <View style={styles.playButton}>
                    <Play size={14} color={colors.text.inverse} fill={colors.text.inverse} />
                  </View>
                </View>
              )}
              
              {/* Card Content */}
              <View style={styles.cardContent}>
                <Text style={[
                  styles.cardTitle,
                  isCompleted && styles.cardTitleCompleted,
                ]}>{exercise.name}</Text>
                <View style={styles.cardMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={10} color={isCompleted ? colors.brand.primary : colors.text.subtle} />
                    <Text style={styles.metaText}>{exercise.duration}</Text>
                  </View>
                  {exercise.reps && (
                    <View style={styles.metaItem}>
                      <Dumbbell size={10} color={isCompleted ? colors.brand.primary : colors.text.subtle} />
                      <Text style={styles.metaText}>{exercise.reps}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.muscleTag}>
                  <Text style={styles.muscleTagText}>{exercise.muscleGroup}</Text>
                </View>
              </View>
            </AnimatedPressable>
            </FadeInView>
          );
        })}
        
        {/* Empty State */}
        {filteredExercises.length === 0 && (
          <EmptyState
            icon={<Search size={40} color={colors.gray[1200]} />}
            title="No exercises found"
            subtitle="Try a different search or category"
          />
        )}
        
        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Start Workout Button */}
      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.startButton} activeOpacity={0.85}>
          <Play size={20} color={colors.text.primary} fill={colors.text.primary} />
          <Text style={styles.startButtonText}>
            {completedCount > 0 && completedCount < totalCount 
              ? 'Continue Workout' 
              : completedCount === totalCount 
                ? 'Restart Workout' 
                : `Start ${totalCount} Exercises`}
            </Text>
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

  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.sm,
  },
  modeBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
    textTransform: 'uppercase',
  },

  // Search
  searchContainer: {
    paddingHorizontal: spacing.screen.paddingHorizontal,
    marginBottom: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    borderRadius: spacing.radius.md,
    paddingHorizontal: spacing.lg,
    height: spacing.iconContainer,
    gap: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    padding: 0,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screen.paddingHorizontal,
    marginBottom: spacing.lg,
  },
  statsText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.disabled,
  },
  statsHighlight: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
  },
  progressBadge: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.heading,
    color: colors.brand.primary,
  },
  // Grid Layout
  exerciseList: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.screen.paddingHorizontal,
    paddingBottom: 100,
  },
  gridCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.25,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    marginBottom: CARD_GAP,
    backgroundColor: colors.background.surface,
  },
  gridCardLeft: {
    marginRight: CARD_GAP / 2,
  },
  gridCardRight: {
    marginLeft: CARD_GAP / 2,
  },
  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: spacing.zIndex.overlay,
  },
  cardImageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
  },
  // Recommended Badge
  recommendedBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sequenceBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.brand.cta,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  sequenceText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
  },
  completedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.accent25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: spacing.iconContainer,
    height: spacing.iconContainer,
    borderRadius: spacing['2xl'],
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: spacing.iconButton,
    height: spacing.iconButton,
    borderRadius: spacing.iconButtonRadius,
    backgroundColor: colors.brand.cta,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 2,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
    marginBottom: 6,
  },
  cardTitleCompleted: {
    color: colors.brand.primary,
  },
  cardTitleUnselected: {
    color: colors.text.subtle,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.subtle,
    fontWeight: typography.fontWeight.medium,
  },
  muscleTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.overlay.white12,
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
    borderRadius: 10,
  },
  muscleTagText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    fontWeight: typography.fontWeight.medium,
    textTransform: 'capitalize',
  },
  // Bottom Action
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screen.paddingHorizontal,
    paddingBottom: 34,
    paddingTop: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand.cta,
    borderRadius: spacing.radius.lg,
    height: 56,
    gap: 10,
  },
  startButtonText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
  },
});

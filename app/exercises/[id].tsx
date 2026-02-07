import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Play, Clock, Dumbbell, Check, Search, Sparkles, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BodyView, { ExtendedBodyPart } from 'react-native-body-highlighter';
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 14;
const CARD_WIDTH = (SCREEN_WIDTH - 40 - CARD_GAP) / 2;

// Exercise categories for filtering
const exerciseCategories = [
  { id: 'all', label: 'All' },
  { id: 'warmup', label: 'Warm Up' },
  { id: 'strength', label: 'Strength' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'core', label: 'Core' },
  { id: 'cooldown', label: 'Cool Down' },
];

// Workout data (in real app, this would come from a store/API)
const workoutData: Record<string, {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  calories: number;
  exercises: Array<{
    id: string;
    name: string;
    duration: string;
    reps?: string;
    targetMuscles: ExtendedBodyPart[];
    bodySide: 'front' | 'back';
    category: string;
    muscleGroup: string;
    isRecommended: boolean; // Based on user's onboarding body parts
  }>;
}> = {
  '1': {
    id: '1',
    title: 'Full Body',
    subtitle: 'Exercise',
    duration: '45 min',
    calories: 320,
    exercises: [
      { id: 'e1', name: 'Warm Up Jog', duration: '5 min', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'calves', intensity: 2 }], bodySide: 'front', category: 'warmup', muscleGroup: 'full', isRecommended: true },
      { id: 'e2', name: 'Push Ups', duration: '3 min', reps: '3 x 15', targetMuscles: [{ slug: 'chest', intensity: 2 }, { slug: 'deltoids', intensity: 2 }, { slug: 'triceps', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'chest', isRecommended: true },
      { id: 'e3', name: 'Squats', duration: '4 min', reps: '3 x 20', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'gluteal', intensity: 2 }, { slug: 'hamstring', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'legs', isRecommended: true },
      { id: 'e4', name: 'Plank Hold', duration: '3 min', reps: '3 x 45s', targetMuscles: [{ slug: 'abs', intensity: 2 }, { slug: 'obliques', intensity: 2 }, { slug: 'deltoids', intensity: 2 }], bodySide: 'front', category: 'core', muscleGroup: 'abs', isRecommended: true },
      { id: 'e5', name: 'Lunges', duration: '4 min', reps: '3 x 12', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'gluteal', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'legs', isRecommended: false },
      { id: 'e6', name: 'Burpees', duration: '4 min', reps: '3 x 10', targetMuscles: [{ slug: 'chest', intensity: 2 }, { slug: 'quadriceps', intensity: 2 }, { slug: 'abs', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'full', isRecommended: false },
      { id: 'e7', name: 'Mountain Climbers', duration: '3 min', reps: '3 x 30s', targetMuscles: [{ slug: 'abs', intensity: 2 }, { slug: 'obliques', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'core', isRecommended: false },
      { id: 'e8', name: 'Jumping Jacks', duration: '3 min', targetMuscles: [{ slug: 'deltoids', intensity: 2 }, { slug: 'quadriceps', intensity: 2 }, { slug: 'calves', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'full', isRecommended: false },
      { id: 'e9', name: 'Tricep Dips', duration: '3 min', reps: '3 x 12', targetMuscles: [{ slug: 'triceps', intensity: 2 }, { slug: 'deltoids', intensity: 2 }], bodySide: 'back', category: 'strength', muscleGroup: 'arms', isRecommended: false },
      { id: 'e10', name: 'Cool Down Stretch', duration: '5 min', targetMuscles: [{ slug: 'hamstring', intensity: 2 }, { slug: 'quadriceps', intensity: 2 }], bodySide: 'front', category: 'cooldown', muscleGroup: 'full', isRecommended: true },
    ],
  },
  '2': {
    id: '2',
    title: 'Chest & Arms',
    subtitle: 'Strength',
    duration: '35 min',
    calories: 280,
    exercises: [
      { id: 'e1', name: 'Arm Circles', duration: '3 min', targetMuscles: [{ slug: 'deltoids', intensity: 2 }], bodySide: 'front', category: 'warmup', muscleGroup: 'arms', isRecommended: true },
      { id: 'e2', name: 'Diamond Push Ups', duration: '4 min', reps: '3 x 12', targetMuscles: [{ slug: 'chest', intensity: 2 }, { slug: 'triceps', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'chest', isRecommended: true },
      { id: 'e3', name: 'Tricep Dips', duration: '4 min', reps: '3 x 15', targetMuscles: [{ slug: 'triceps', intensity: 2 }], bodySide: 'back', category: 'strength', muscleGroup: 'arms', isRecommended: true },
      { id: 'e4', name: 'Bicep Curls', duration: '4 min', reps: '3 x 12', targetMuscles: [{ slug: 'biceps', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'arms', isRecommended: true },
      { id: 'e5', name: 'Wide Push Ups', duration: '4 min', reps: '3 x 12', targetMuscles: [{ slug: 'chest', intensity: 2 }, { slug: 'deltoids', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'chest', isRecommended: false },
      { id: 'e6', name: 'Shoulder Taps', duration: '3 min', reps: '3 x 20', targetMuscles: [{ slug: 'deltoids', intensity: 2 }, { slug: 'abs', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'shoulders', isRecommended: false },
    ],
  },
  '3': {
    id: '3',
    title: 'HIIT Cardio',
    subtitle: 'Fat Burn',
    duration: '25 min',
    calories: 350,
    exercises: [
      { id: 'e1', name: 'Jumping Jacks', duration: '3 min', targetMuscles: [{ slug: 'deltoids', intensity: 2 }, { slug: 'quadriceps', intensity: 2 }, { slug: 'calves', intensity: 2 }], bodySide: 'front', category: 'warmup', muscleGroup: 'full', isRecommended: true },
      { id: 'e2', name: 'Burpees', duration: '4 min', reps: '4 x 10', targetMuscles: [{ slug: 'chest', intensity: 2 }, { slug: 'quadriceps', intensity: 2 }, { slug: 'abs', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'full', isRecommended: true },
      { id: 'e3', name: 'High Knees', duration: '3 min', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'abs', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'legs', isRecommended: true },
      { id: 'e4', name: 'Mountain Climbers', duration: '4 min', reps: '3 x 30s', targetMuscles: [{ slug: 'abs', intensity: 2 }, { slug: 'obliques', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'core', isRecommended: true },
      { id: 'e5', name: 'Box Jumps', duration: '4 min', reps: '3 x 12', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'gluteal', intensity: 2 }, { slug: 'calves', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'legs', isRecommended: false },
      { id: 'e6', name: 'Sprint Intervals', duration: '5 min', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'hamstring', intensity: 2 }, { slug: 'calves', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'legs', isRecommended: false },
    ],
  },
  '4': {
    id: '4',
    title: 'Leg Day',
    subtitle: 'Power',
    duration: '40 min',
    calories: 300,
    exercises: [
      { id: 'e1', name: 'Leg Swings', duration: '3 min', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'hamstring', intensity: 2 }], bodySide: 'front', category: 'warmup', muscleGroup: 'legs', isRecommended: true },
      { id: 'e2', name: 'Goblet Squats', duration: '5 min', reps: '4 x 12', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'gluteal', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'legs', isRecommended: true },
      { id: 'e3', name: 'Walking Lunges', duration: '5 min', reps: '3 x 20', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'gluteal', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'legs', isRecommended: true },
      { id: 'e4', name: 'Calf Raises', duration: '4 min', reps: '3 x 20', targetMuscles: [{ slug: 'calves', intensity: 2 }], bodySide: 'back', category: 'strength', muscleGroup: 'legs', isRecommended: true },
      { id: 'e5', name: 'Glute Bridges', duration: '4 min', reps: '3 x 15', targetMuscles: [{ slug: 'gluteal', intensity: 2 }, { slug: 'hamstring', intensity: 2 }], bodySide: 'back', category: 'strength', muscleGroup: 'glutes', isRecommended: false },
      { id: 'e6', name: 'Wall Sit', duration: '3 min', reps: '3 x 45s', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'legs', isRecommended: false },
    ],
  },
};

export default function ExercisesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = workoutData[id || '1'];
  
  // State - simplified
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  // Filter exercises based on search and category
  const filteredExercises = useMemo(() => {
    if (!workout) return [];
    
    return workout.exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           exercise.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [workout, searchQuery, selectedCategory]);

  // Calculate stats
  const totalCount = workout?.exercises.length || 0;
  const completedCount = completedExercises.size;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Calculate total duration
  const totalDuration = useMemo(() => {
    if (!workout) return '0 min';
    const totalMinutes = workout.exercises.reduce((acc, e) => {
      const mins = parseInt(e.duration) || 0;
      return acc + mins;
    }, 0);
    return `${totalMinutes} min`;
  }, [workout]);

  const toggleExerciseCompleted = (exerciseId: string) => {
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
        <Text style={styles.errorText}>Workout not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle}>{workout.title}</Text>
          <Text style={styles.headerSubtitle}>{workout.subtitle}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color="#666666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {exerciseCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.8}
              style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
            >
              <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelActive]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
            <TouchableOpacity 
              key={exercise.id} 
              style={[
                styles.gridCard,
                index % 2 === 0 ? styles.gridCardLeft : styles.gridCardRight,
              ]}
              activeOpacity={0.9}
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
                  gender="male"
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
              {exercise.isRecommended && (
                <View style={styles.recommendedBadge}>
                  <Sparkles size={10} color="#000000" />
                </View>
              )}
              
              {/* Completed Overlay */}
              {isCompleted && (
                <View style={styles.completedOverlay}>
                  <View style={styles.checkCircle}>
                    <Check size={20} color="#000000" />
                  </View>
                </View>
              )}

              {/* Play Button (for non-completed) */}
              {!isCompleted && (
                <View style={styles.playButtonWrapper}>
                  <View style={styles.playButton}>
                    <Play size={14} color="#000000" fill="#000000" />
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
                    <Clock size={10} color={isCompleted ? '#CDFC00' : '#888888'} />
                    <Text style={styles.metaText}>{exercise.duration}</Text>
                  </View>
                  {exercise.reps && (
                    <View style={styles.metaItem}>
                      <Dumbbell size={10} color={isCompleted ? '#CDFC00' : '#888888'} />
                      <Text style={styles.metaText}>{exercise.reps}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.muscleTag}>
                  <Text style={styles.muscleTagText}>{exercise.muscleGroup}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        
        {/* Empty State */}
        {filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Search size={40} color="#333333" />
            <Text style={styles.emptyStateText}>No exercises found</Text>
            <Text style={styles.emptyStateSubtext}>Try a different search or category</Text>
          </View>
        )}
        
        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Start Workout Button */}
      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.startButton} activeOpacity={0.85}>
          <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
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
    backgroundColor: '#0A0A0A',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleArea: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Audiowide',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  headerSpacer: {
    width: 44,
  },
  // Search
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    padding: 0,
  },
  // Categories
  categoryScroll: {
    maxHeight: 44,
    marginBottom: 16,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryPill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
  },
  categoryPillActive: {
    backgroundColor: '#CDFC00',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  categoryLabelActive: {
    color: '#000000',
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: '#666666',
  },
  statsHighlight: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressBadge: {
    fontSize: 13,
    fontFamily: 'Audiowide',
    color: '#CDFC00',
  },
  // Grid Layout
  exerciseList: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  gridCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.25,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: CARD_GAP,
    backgroundColor: '#1A1A1A',
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
    zIndex: 10,
  },
  cardImageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
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
    top: 12,
    right: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#CDFC00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(205, 252, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#CDFC00',
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 2,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Audiowide',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  cardTitleCompleted: {
    color: '#CDFC00',
  },
  cardTitleUnselected: {
    color: '#888888',
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '500',
  },
  muscleTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  muscleTagText: {
    fontSize: 10,
    color: '#AAAAAA',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  // Empty State
  emptyState: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Audiowide',
    color: '#666666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#444444',
    marginTop: 4,
  },
  // Bottom Action
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 16,
    backgroundColor: '#0A0A0A',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    height: 56,
    gap: 10,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: 'Averta-Bold',
    color: '#FFFFFF',
  },
});

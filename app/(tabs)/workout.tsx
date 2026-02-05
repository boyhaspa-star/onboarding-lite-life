import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, ImageStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import Svg, { Circle, Text as SvgText, Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const categories = [
  { id: 'all', label: 'All' },
  { id: 'upper', label: 'Upper' },
  { id: 'core', label: 'Core' },
  { id: 'lower', label: 'Lower' },
  { id: 'cardio', label: 'Cardio' },
];

const workoutPrograms: Array<{
  id: string;
  title: string;
  subtitle: string;
  category: string;
  progress: number;
  duration: string;
  exercises: number;
  image: any;
  imageStyle: ImageStyle;
}> = [
  {
    id: '1',
    title: 'Full Body',
    subtitle: 'Exercise',
    category: 'all',
    progress: 50,
    duration: '45 min',
    exercises: 12,
    image: require('@/assets/images/plank-exercise.png'),
    imageStyle: { bottom: 15, right: -15, width: '75%' as any, height: '75%' as any },
  },
  {
    id: '2',
    title: 'Chest & Arms',
    subtitle: 'Strength',
    category: 'upper',
    progress: 25,
    duration: '35 min',
    exercises: 8,
    image: require('@/assets/images/squate.png'),
    imageStyle: { bottom: 5, right: 5, width: '50%' as any, height: '85%' as any },
  },
  {
    id: '3',
    title: 'HIIT Cardio',
    subtitle: 'Fat Burn',
    category: 'cardio',
    progress: 60,
    duration: '25 min',
    exercises: 10,
    image: require('@/assets/images/cardio.png'),
    imageStyle: { bottom: 5, right: 10, width: '50%' as any, height: '85%' as any },
  },
  {
    id: '4',
    title: 'Leg Day',
    subtitle: 'Power',
    category: 'lower',
    progress: 0,
    duration: '40 min',
    exercises: 9,
    image: require('@/assets/images/yoga.png'),
    imageStyle: { bottom: 5, right: 10, width: '50%' as any, height: '85%' as any },
  },
];

export default function WorkoutScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredWorkouts = selectedCategory === 'all' 
    ? workoutPrograms 
    : workoutPrograms.filter(w => w.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Workouts</Text>
          <Text style={styles.pageSubtitle}>{workoutPrograms.length} programs available</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Bell size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Category Pills - Horizontal Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.8}
              style={[
                styles.categoryPill,
                isSelected && styles.categoryPillActive,
              ]}>
              <Text
                style={[
                  styles.categoryLabel,
                  isSelected && styles.categoryLabelActive,
                ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Workout Cards */}
      <ScrollView 
        style={styles.workoutList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.workoutListContent}
      >
        {filteredWorkouts.map((workout, index) => (
          <TouchableOpacity 
            key={workout.id} 
            style={styles.workoutCard}
            activeOpacity={0.9}
            onPress={() => router.push(`/exercises/${workout.id}`)}
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
                />
              </Svg>
            </View>

            {/* Workout Image */}
            <Image
              source={workout.image}
              style={[styles.workoutImage, workout.imageStyle]}
              resizeMode="contain"
            />

            {/* Card Content */}
            <View style={styles.cardContent}>
              {/* Title & Meta */}
              <View style={styles.cardHeader}>
                <View style={styles.titleArea}>
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                  <Text style={styles.workoutSubtitle}>{workout.subtitle}</Text>
                </View>
                
                {/* Progress Ring */}
                <View style={styles.progressRing}>
                  <Svg width={52} height={52} viewBox="0 0 52 52">
                    <Circle
                      cx="26"
                      cy="26"
                      r="21"
                      fill="none"
                      stroke="#252525"
                      strokeWidth="4"
                    />
                    {workout.progress > 0 && (
                      <Circle
                        cx="26"
                        cy="26"
                        r="21"
                        fill="none"
                        stroke="#CDFC00"
                        strokeWidth="4"
                        strokeDasharray={`${132 * (workout.progress / 100)} 132`}
                        strokeLinecap="round"
                        transform="rotate(-90 26 26)"
                      />
                    )}
                    <SvgText
                      x="26"
                      y="30"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#FFFFFF">
                      {workout.progress}%
                    </SvgText>
                  </Svg>
                </View>
              </View>

              {/* Meta Info */}
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaValue}>{workout.duration}</Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <Text style={styles.metaValue}>{workout.exercises} exercises</Text>
                </View>
              </View>
            </View>

            {/* Start Button */}
            <TouchableOpacity style={styles.startButton} activeOpacity={0.85}>
              <Text style={styles.startButtonText}>
                {workout.progress > 0 ? 'Continue' : 'Start'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
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
    backgroundColor: '#0A0A0A',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: 'Audiowide',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Categories
  categoryScroll: {
    maxHeight: 44,
    marginBottom: 20,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#252525',
  },
  categoryPillActive: {
    backgroundColor: '#CDFC00',
    borderColor: '#CDFC00',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
  },
  categoryLabelActive: {
    color: '#000000',
  },
  // Workout List
  workoutList: {
    flex: 1,
  },
  workoutListContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  // Workout Card
  workoutCard: {
    height: 160,
    borderRadius: 16,
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
  workoutImage: {
    position: 'absolute',
    opacity: 0.9,
  },
  cardContent: {
    flex: 1,
    padding: 18,
    paddingBottom: 55,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleArea: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 22,
    fontFamily: 'Audiowide',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  progressRing: {
    marginLeft: 12,
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
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333333',
    marginHorizontal: 10,
  },
  // Start Button
  startButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#FF6B35',
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 28,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 14,
    fontFamily: 'Averta-Bold',
    color: '#FFFFFF',
  },
});

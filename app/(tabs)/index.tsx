import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Search, Bell } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import PagerView from 'react-native-pager-view';
import StackIcon from '@/components/icons/StackIcon';
import { ProgressRing } from '@/components';
import { colors, typography, spacing } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const days = [
  { id: 'sun', label: 'Sun', date: '01' },
  { id: 'mon', label: 'Mon', date: '02' },
  { id: 'tue', label: 'Tue', date: '03' },
  { id: 'wed', label: 'Wed', date: '04' },
  { id: 'thu', label: 'Thu', date: '05' },
  { id: 'fri', label: 'Fri', date: '06' },
];

const goalCards = [
  { 
    id: '1', 
    title: 'Full Body', 
    subtitle: 'Exercise', 
    emoji: '💪', 
    progress: 50, 
    image: require('@/assets/images/plank-exercise.png'),
    imageStyle: { bottom:45, right: -10, width: '105%', height: '70%' }  // Horizontal plank
  },
  { 
    id: '2', 
    title: 'Cardio', 
    subtitle: 'Workout', 
    emoji: '🏃', 
    progress: 30, 
    image: require('@/assets/images/squate.png'),
    imageStyle: { bottom: 0, right: 23, width: '55%', height: '95%' }  // Vertical squat
  },
  { 
    id: '3', 
    title: 'Strength', 
    subtitle: 'Training', 
    emoji: '🏋️', 
    progress: 75,
    image: require('@/assets/images/cardio.png'),
    imageStyle: { bottom: 0, right: 10, width: '55%', height: '95%' }  // Vertical running pose
  },
];

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState('sun');
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);
  const exerciseCount = 12;
  const completedExercises = 3;
  const completionPercentage = Math.round((completedExercises / exerciseCount) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.mainContent}>
        
        {/* Header with Weather and Actions */}
        <View style={styles.header}>
          <View style={styles.weatherSection}>
            <Text style={styles.temperature}>18° Partly Cloudly</Text>
            <Text style={styles.location}>San Diego, California</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={22} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={22} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Week Calendar */}
        <View style={styles.weekContainer}>
          {days.map((day) => {
            const isSelected = selectedDay === day.id;
            return (
              <TouchableOpacity
                key={day.id}
                onPress={() => setSelectedDay(day.id)}
                activeOpacity={0.8}
                style={[
                  styles.dayColumn,
                  isSelected && styles.dayColumnActive,
                ]}>
                <Text
                  style={[
                    styles.dayLabel,
                    isSelected && styles.dayLabelActive,
                  ]}>
                  {day.label}
                </Text>
                <View
                  style={[
                    styles.dateBox,
                    isSelected && styles.dateBoxActive,
                  ]}>
                  <Text
                    style={[
                      styles.dateNumber,
                      isSelected && styles.dateNumberActive,
                    ]}>
                    {day.date}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Full Body Exercise Card - Glass Effect */}
        <View style={styles.exerciseCard}>
          {/* Glass Background SVG */}
          <View style={styles.cardBackground}>
            <Svg width="100%" height="100%" viewBox="0 0 343 186" preserveAspectRatio="none">
              <Defs>
                <LinearGradient id="cardGradient" x1="0" y1="0" x2="343" y2="186" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.15" />
                  <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.05" />
                </LinearGradient>
                <LinearGradient id="borderGradient" x1="0" y1="0" x2="343" y2="186" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.1" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="343" height="186" rx="20" fill="url(#cardGradient)" />
              <Rect x="0.5" y="0.5" width="342" height="185" rx="19.5" stroke="url(#borderGradient)" strokeWidth="1" fill="none" />
            </Svg>
          </View>
          
          {/* Card Content */}
          <View style={styles.exerciseCardContent}>
            <View style={styles.exerciseCardTop}>
              <View style={styles.exerciseTitleRow}>
                <View style={styles.stackIconContainer}>
                  <StackIcon width={20} height={32} />
                </View>
                <View style={styles.exerciseTitleSection}>
                  <Text style={styles.exerciseTitle}>Your Daily</Text>
                  <Text style={styles.exerciseTitle}>Progress</Text>
                </View>
              </View>
              
              {/* Progress Circle - Lime Green */}
              <View style={styles.progressCircle}>
                <ProgressRing percentage={completionPercentage} />
              </View>
            </View>
            
            {/* Start Workout Button - Orange */}
            <TouchableOpacity style={styles.startWorkoutButton} activeOpacity={0.85}>
              <Text style={styles.startWorkoutText}>Start workout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Goal Section */}
        <Text style={styles.sectionTitle}>Daily Goal</Text>
        
        {/* Goal Cards Swiper - Takes remaining height */}
        <View style={styles.goalSwiperContainer}>
          <PagerView
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={(e) => setActiveGoalIndex(e.nativeEvent.position)}
        >
          {goalCards.map((item, index) => (
            <View key={item.id} style={styles.goalCardPage}>
              <View style={styles.goalCard}>
                {/* SVG Shape - L-shape with button cutout */}
                <View style={styles.goalCardBackground}>
                  <Svg width="100%" height="100%" viewBox="0 0 327 184" preserveAspectRatio="none">
                    <Defs>
                      <LinearGradient id={`goalCardGradient-${index}`} x1="0" y1="0" x2="327" y2="176" gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.15" />
                        <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.05" />
                      </LinearGradient>
                      <LinearGradient id={`goalBorderGradient-${index}`} x1="0" y1="0" x2="327" y2="176" gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.4" />
                        <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.1" />
                      </LinearGradient>
                    </Defs>
                    {/* Fill - L-shape with glass gradient */}
                    <Path 
                      d="M16 0C7.163 0 0 7.163 0 16V136H155C163.837 136 171 143.163 171 152V160C171 168.837 178.163 176 187 176H311C319.837 176 327 168.837 327 160V16C327 7.163 319.837 0 311 0H16Z" 
                      fill={`url(#goalCardGradient-${index})`}
                    />
                    {/* Border - glass border gradient */}
                    <Path 
                      d="M16 2C8.268 2 2 8.268 2 16V134H155C164.941 134 173 142.059 173 152V160C173 167.732 179.268 174 187 174H311C318.732 174 325 167.732 325 160V16C325 8.268 318.732 2 311 2H16Z" 
                      fill="none"
                      stroke={`url(#goalBorderGradient-${index})`}
                      strokeWidth="1"
                    />
                  </Svg>
                </View>
                
                {/* Exercise Image */}
                {item.image && (
                  <Image
                    source={item.image}
                    style={[styles.goalExerciseImage, item.imageStyle as any]}
                    resizeMode="contain"
                  />
                )}
                
                {/* Card Content - Same layout as Daily Progress */}
                <View style={styles.goalCardContent}>
                  <View style={styles.goalCardTop}>
                    <View style={styles.goalTitleRow}>
                      <View style={styles.goalIconContainer}>
                        <Text style={styles.goalEmoji}>{item.emoji}</Text>
                      </View>
                      <View style={styles.goalTitleSection}>
                        <Text style={styles.goalTitle}>{item.title}</Text>
                        <Text style={styles.goalTitle}>{item.subtitle}</Text>
                      </View>
                    </View>
                    
                    {/* Progress Circle */}
                    <View style={styles.goalProgressCircle}>
                      <ProgressRing percentage={item.progress} />
                    </View>
                  </View>
                </View>
                
                {/* Start Workout Button - Positioned in cutout */}
                <TouchableOpacity style={styles.goalStartButton} activeOpacity={0.85}>
                  <Text style={styles.goalStartButtonText}>Start workout</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </PagerView>
        
        {/* Page Indicators */}
        <View style={styles.indicatorContainer}>
          {goalCards.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                activeGoalIndex === index && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingTop: spacing.screen.paddingTop,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  weatherSection: {
    flex: 1,
  },
  temperature: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  location: {
    fontSize: typography.fontSize.lg,
    color: colors.text.muted,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconButton: {
    width: spacing.iconButton,
    height: spacing.iconButton,
    borderRadius: spacing.iconButtonRadius,
    backgroundColor: colors.overlay.white10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.gray[1200],
    borderRadius: spacing.radius['2xl'],
  },
  dayColumnActive: {
    backgroundColor: colors.brand.primary,
  },
  dayLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: 6,
  },
  dayLabelActive: {
    color: colors.text.inverse,
  },
  dateBox: {
    width: 36,
    height: 36,
    backgroundColor: colors.background.elevated,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBoxActive: {
    backgroundColor: colors.background.pure,
  },
  dateNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.secondary,
  },
  dateNumberActive: {
    color: colors.text.primary,
  },
  exerciseCard: {
    height: 186,
    borderRadius: spacing.radius.xl,
    marginBottom: spacing['2xl'],
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
  exerciseCardContent: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  exerciseCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exerciseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stackIconContainer: {
    width: spacing.iconButton,
    height: spacing.iconButton,
    borderRadius: spacing.iconButtonRadius,
    backgroundColor: colors.overlay.dark80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  exerciseTitleSection: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: typography.fontSize['5xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
    lineHeight: 34,
  },
  progressCircle: {
    width: spacing.iconContainerXl,
    height: spacing.iconContainerXl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startWorkoutButton: {
    backgroundColor: colors.brand.cta,
    borderRadius: spacing.radius['3xl'],
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    alignSelf: 'flex-start',
  },
  startWorkoutText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
  },
  sectionTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  goalSwiperContainer: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  goalCardPage: {
    flex: 1,
    paddingRight: spacing.lg,
  },
  goalCard: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: spacing.radius.xl,
    borderBottomRightRadius: spacing.radius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  goalCardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  goalCardContent: {
    flex: 1,
    padding: spacing.xl,
    paddingBottom: spacing.iconContainerLg,
  },
  goalExerciseImage: {
    position: 'absolute',
    opacity: 0.9,
  },
  goalCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIconContainer: {
    width: spacing.iconButton,
    height: spacing.iconButton,
    borderRadius: spacing.iconButtonRadius,
    backgroundColor: colors.overlay.dark80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  goalEmoji: {
    fontSize: typography.fontSize['3xl'],
  },
  goalTitleSection: {
    flex: 1,
  },
  goalTitle: {
    fontSize: typography.fontSize['4xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
    lineHeight: 30,
  },
  goalProgressCircle: {
    width: spacing.iconContainerXl,
    height: spacing.iconContainerXl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalStartButton: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    backgroundColor: colors.brand.cta,
    borderTopRightRadius: spacing.radius.xl,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: spacing.radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    width: '52%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalStartButtonText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  indicator: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.xs,
    backgroundColor: colors.gray[1200],
  },
  indicatorActive: {
    backgroundColor: colors.brand.primary,
    width: spacing['2xl'],
  },
});

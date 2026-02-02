import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Search, Bell } from 'lucide-react-native';
import Svg, { Circle, Text as SvgText, Defs, LinearGradient, Stop, Rect, Path, ClipPath, G, Mask } from 'react-native-svg';
import PagerView from 'react-native-pager-view';
import StackIcon from '@/components/icons/StackIcon';

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
              <Search size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={22} color="#FFFFFF" />
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
                <Svg width={70} height={70} viewBox="0 0 70 70">
                  <Circle
                    cx="35"
                    cy="35"
                    r="28"
                    fill="none"
                    stroke="#373E16"
                    strokeWidth="5"
                  />
                  <Circle
                    cx="35"
                    cy="35"
                    r="28"
                    fill="none"
                    stroke="#CDFC00"
                    strokeWidth="5"
                    strokeDasharray={`${176 * (completionPercentage / 100)} 176`}
                    strokeLinecap="round"
                    transform="rotate(-90 35 35)"
                  />
                  <SvgText
                    x="35"
                    y="40"
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="600"
                    fill="#FFFFFF">
                    {completionPercentage}%
                  </SvgText>
                </Svg>
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
                    style={[styles.goalExerciseImage, item.imageStyle]}
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
                      <Svg width={70} height={70} viewBox="0 0 70 70">
                        <Circle
                          cx="35"
                          cy="35"
                          r="28"
                          fill="none"
                          stroke="#373E16"
                          strokeWidth="5"
                        />
                        <Circle
                          cx="35"
                          cy="35"
                          r="28"
                          fill="none"
                          stroke="#CDFC00"
                          strokeWidth="5"
                          strokeDasharray={`${176 * (item.progress / 100)} 176`}
                          strokeLinecap="round"
                          transform="rotate(-90 35 35)"
                        />
                        <SvgText
                          x="35"
                          y="40"
                          textAnchor="middle"
                          fontSize="16"
                          fontWeight="600"
                          fill="#FFFFFF">
                          {item.progress}%
                        </SvgText>
                      </Svg>
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
    backgroundColor: '#0A0A0A',
  },
  paddingTop: 8,
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 16,
  },
  weatherSection: {
    flex: 1,
  },
  temperature: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#999999',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: '#333333',
    borderRadius: 24,
  },
  dayColumnActive: {
    backgroundColor: '#CDFC00',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  dayLabelActive: {
    color: '#000000',
  },
  dateBox: {
    width: 36,
    height: 36,
    backgroundColor: '#1F1F1F',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBoxActive: {
    backgroundColor: '#000000',
  },
  dateNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C3C3C3',
  },
  dateNumberActive: {
    color: '#FFFFFF',
  },
  exerciseCard: {
    height: 186,
    borderRadius: 20,
    marginBottom: 24,
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
    padding: 20,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseTitleSection: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 28,
    fontFamily: 'Audiowide',
    color: '#FFFFFF',
    lineHeight: 34,
  },
  progressCircle: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startWorkoutButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
  },
  startWorkoutText: {
    fontSize: 16,
    fontFamily: 'Averta-Bold',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  goalSwiperContainer: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  goalCardPage: {
    flex: 1,
    paddingRight: 16,
  },
  goalCard: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
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
    padding: 20,
    paddingBottom: 60,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalEmoji: {
    fontSize: 20,
  },
  goalTitleSection: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 24,
    fontFamily: 'Audiowide',
    color: '#FFFFFF',
    lineHeight: 30,
  },
  goalProgressCircle: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalStartButton: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    backgroundColor: '#FF6B35',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '52%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalStartButtonText: {
    fontSize: 16,
    fontFamily: 'Averta-Bold',
    color: '#FFFFFF',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
  },
  indicatorActive: {
    backgroundColor: '#CDFC00',
    width: 24,
  },
});

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Search, Bell } from 'lucide-react-native';
import Svg, { Circle, Text as SvgText, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
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

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState('sun');
  const exerciseCount = 12;
  const completedExercises = 3;
  const completionPercentage = Math.round((completedExercises / exerciseCount) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
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
        
        {/* Goal Card 1 */}
        <View style={styles.goalCard}>
          <View style={styles.goalCardPlaceholder} />
          <View style={styles.goalCardFooter}>
            <Text style={styles.goalCardText}>Do 5 exercises today</Text>
            <TouchableOpacity style={styles.goalCardButton}>
              <ChevronRight size={20} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Goal Card 2 */}
        <View style={styles.goalCard}>
          <View style={styles.goalCardPlaceholder} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 20,
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
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  goalCardPlaceholder: {
    height: 140,
    backgroundColor: '#D9D9D9',
  },
  goalCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  goalCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  goalCardButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CDFC00',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

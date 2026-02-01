import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, Play } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const days = [
  { id: 'sun', label: 'Sun', date: '01', isActive: false },
  { id: 'mon', label: 'Mon', date: '02', isActive: false },
  { id: 'tue', label: 'Tue', date: '03', isActive: false },
  { id: 'wed', label: 'Wed', date: '04', isActive: true },
  { id: 'thu', label: 'Thu', date: '05', isActive: false },
  { id: 'fri', label: 'Fri', date: '06', isActive: false },
  { id: 'sat', label: 'Sat', date: '07', isActive: false },
];

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState('wed');
  const exerciseCount = 12;
  const completedExercises = 3;
  const completionPercentage = Math.round((completedExercises / exerciseCount) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#0A0A0A', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}>
          <View style={styles.header}>
            <View style={styles.weatherSection}>
              <Text style={styles.temperature}>18°</Text>
              <View>
                <Text style={styles.weatherStatus}>Partly Cloudy</Text>
                <Text style={styles.location}>San Diego, California</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Search size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Bell size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.weekSection}>
            <Text style={styles.sectionTitle}>This Week</Text>
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
          </View>

          <View style={styles.goalsSection}>
            <View style={styles.goalsHeader}>
              <View>
                <Text style={styles.goalsTitle}>Daily Goals</Text>
                <Text style={styles.goalsSubtitle}>
                  {exerciseCount} Excersie Left
                </Text>
              </View>
              <View style={styles.progressCircle}>
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  style={styles.svg}>
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="#373E16"
                    strokeWidth="0"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="#CDFC00"
                    strokeWidth="6"
                    strokeDasharray={`${88 * (completionPercentage / 100)} 220`}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                  <text
                    x="40"
                    y="45"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="500"
                    fill="#FFFFFF">
                    {completionPercentage}%
                  </text>
                </svg>
              </View>
            </View>
          </View>

          <View style={styles.workoutCard}>
            <View style={styles.workoutContent}>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutTitle}>Ready to Start?</Text>
                <Text style={styles.workoutDesc}>
                  Begin your personalized workout
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.startButton} activeOpacity={0.85}>
            <Text style={styles.startButtonText}>Start Workout</Text>
            <Play size={20} color="#000000" fill="#000000" />
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 32,
  },
  weatherSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  temperature: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weatherStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  location: {
    fontSize: 12,
    fontWeight: '400',
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
  weekSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: '#333333',
    borderRadius: 16,
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
    width: 40,
    height: 40,
    backgroundColor: '#1F1F1F',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBoxActive: {
    backgroundColor: '#000000',
  },
  dateNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#C3C3C3',
  },
  dateNumberActive: {
    color: '#FFFFFF',
  },
  goalsSection: {
    backgroundColor: '#191919',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  goalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  goalsSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  progressCircle: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    width: 80,
    height: 80,
  },
  workoutCard: {
    backgroundColor: '#191919',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  workoutContent: {
    justifyContent: 'center',
  },
  workoutInfo: {
    gap: 8,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#CDFC00',
  },
  workoutDesc: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  startButton: {
    backgroundColor: '#CDFC00',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
});

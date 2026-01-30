import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 60; i <= currentYear - 13; i++) {
    years.push(i);
  }
  return years;
};

export default function BirthdayScreen() {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedYear, setSelectedYear] = useState(2000);

  const monthScrollRef = useRef<ScrollView>(null);
  const dayScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);

  const days = Array.from(
    { length: getDaysInMonth(selectedMonth, selectedYear) },
    (_, i) => i + 1,
  );
  const years = generateYears();

  const handleContinue = () => {
    router.push('/onboarding/fitnessLevel');
  };

  const DateColumn = ({
    data,
    selectedValue,
    onSelect,
    scrollRef,
  }: {
    data: (string | number)[];
    selectedValue: string | number;
    onSelect: (value: string | number) => void;
    scrollRef: React.RefObject<ScrollView>;
  }) => {
    return (
      <View style={styles.dateColumnContainer}>
        <ScrollView
          ref={scrollRef}
          style={styles.dateScroll}
          showsVerticalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          scrollEventThrottle={16}>
          <View style={styles.dateScrollSpacer} />
          {data.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => onSelect(item)}
              activeOpacity={0.6}
              style={styles.dateItem}>
              <Text
                style={[
                  styles.dateItemText,
                  selectedValue === item && styles.dateItemTextSelected,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.dateScrollSpacer} />
        </ScrollView>
        <View style={styles.dateHighlight} pointerEvents="none" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
            <Text style={styles.pageIndicator}>2 of 4</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.title}>Choose your birthday</Text>

            <View style={styles.musicPlayer}>
              <View style={styles.playerContent}>
                <Text style={styles.playerTitle}>High Intensity Cardio</Text>
                <View style={styles.bpmContainer}>
                  <Text style={styles.bpmText}>123 bpm</Text>
                </View>

                <View style={styles.waveformContainer}>
                  <View style={styles.waveBar} />
                  <View style={styles.waveBar} />
                  <View style={styles.waveBar} />
                  <View style={styles.waveBar} />
                  <View style={styles.waveBar} />
                  <View style={styles.waveBar} />
                  <View style={styles.waveBar} />
                </View>

                <Text style={styles.timeDisplay}>12:54</Text>

                <View style={styles.playerControls}>
                  <TouchableOpacity style={styles.controlButton}>
                    <Text style={styles.controlText}>✕</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlButton}>
                    <Text style={styles.controlText}>⏸</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlButton}>
                    <Text style={styles.controlText}>⏭</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.progressIndicator}>
                  <View style={styles.progressYellow} />
                  <View style={styles.progressGreen} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.datePickerSection}>
            <View style={styles.datePickerContainer}>
              <DateColumn
                data={months}
                selectedValue={months[selectedMonth]}
                onSelect={(value) => setSelectedMonth(months.indexOf(value as string))}
                scrollRef={monthScrollRef}
              />
              <DateColumn
                data={days}
                selectedValue={selectedDay}
                onSelect={(value) => setSelectedDay(value as number)}
                scrollRef={dayScrollRef}
              />
              <DateColumn
                data={years}
                selectedValue={selectedYear}
                onSelect={(value) => setSelectedYear(value as number)}
                scrollRef={yearScrollRef}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.85}>
            <Text style={styles.continueButtonText}>Continue</Text>
            <ArrowRight size={20} color="#000000" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 2,
  },
  pageIndicator: {
    color: '#999999',
    fontSize: 12,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  musicPlayer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
    marginBottom: 20,
  },
  playerContent: {
    alignItems: 'center',
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  bpmContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  bpmText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CCCCCC',
  },
  waveformContainer: {
    width: '100%',
    height: 60,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  waveBar: {
    flex: 1,
    height: 30,
    backgroundColor: '#22c55e',
    borderRadius: 3,
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  playerControls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  controlButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 20,
  },
  progressIndicator: {
    width: '100%',
    height: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  progressYellow: {
    flex: 2,
    backgroundColor: '#E6FE58',
  },
  progressGreen: {
    flex: 1,
    backgroundColor: '#22c55e',
  },
  datePickerSection: {
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
    paddingVertical: 20,
  },
  dateColumnContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateScroll: {
    flex: 1,
  },
  dateScrollSpacer: {
    height: 60,
  },
  dateItem: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateItemText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
  },
  dateItemTextSelected: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dateHighlight: {
    position: 'absolute',
    top: 75,
    left: '10%',
    right: '10%',
    height: 50,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333333',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 8,
  },
  continueButton: {
    backgroundColor: '#E6FE58',
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
});

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const days = [
  { id: 'sun', label: 'Sun', date: '01' },
  { id: 'mon', label: 'Mon', date: '02' },
  { id: 'tue', label: 'Tue', date: '03' },
  { id: 'wed', label: 'Wed', date: '04' },
  { id: 'thu', label: 'Thu', date: '05' },
  { id: 'fri', label: 'Fri', date: '06' },
  { id: 'sat', label: 'Sat', date: '07' },
];

export default function WeekScreen() {
  const [selectedDays, setSelectedDays] = useState<string[]>(['wed']);

  const handleToggleDay = (dayId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleContinue = () => {
    if (selectedDays.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>When are you</Text>
          <Text style={styles.titleAccent}>available?</Text>
        </View>

        <View style={styles.weekContainer}>
          {days.map((day) => {
            const isSelected = selectedDays.includes(day.id);
            return (
              <TouchableOpacity
                key={day.id}
                onPress={() => handleToggleDay(day.id)}
                activeOpacity={0.8}
                style={[
                  styles.dayColumn,
                  isSelected && styles.dayColumnSelected,
                ]}>
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                  {day.label}
                </Text>
                <View
                  style={[
                    styles.dateContainer,
                    isSelected && styles.dateContainerSelected,
                  ]}>
                  <Text
                    style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                    {day.date}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Select the days you plan to workout this week
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedDays.length === 0 && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={selectedDays.length === 0}
            activeOpacity={0.85}>
            <Text
              style={[
                styles.continueButtonText,
                selectedDays.length === 0 && styles.continueButtonTextDisabled,
              ]}>
              Complete Setup
            </Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginRight: 44,
  },
  progressDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333333',
  },
  progressDotActive: {
    backgroundColor: '#CDFC00',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  titleAccent: {
    fontSize: 32,
    fontWeight: '700',
    color: '#CDFC00',
    textAlign: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 32,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    backgroundColor: '#333333',
    borderRadius: 20,
  },
  dayColumnSelected: {
    backgroundColor: '#CDFC00',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  dayLabelSelected: {
    color: '#000000',
  },
  dateContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#1F1F1F',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainerSelected: {
    backgroundColor: '#000000',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#C3C3C3',
    textAlign: 'center',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomSection: {
    marginTop: 'auto',
  },
  continueButton: {
    backgroundColor: '#CDFC00',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#2A2A2A',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  continueButtonTextDisabled: {
    color: '#666666',
  },
});

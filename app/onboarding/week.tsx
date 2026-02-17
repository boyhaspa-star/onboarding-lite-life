import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '@/constants/theme';
import { ProgressDots, ContinueButton, BackButton } from '@/components';
import { onboarding$ } from '@/store/onboarding$';

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
      onboarding$.availableDays.set(selectedDays);
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
          <BackButton variant="plain" onPress={handleBack} />

          <ProgressDots total={5} active={4} />
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
          <ContinueButton
            label="Complete Setup"
            onPress={handleContinue}
            disabled={selectedDays.length === 0}
            variant="lime"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen.paddingHorizontal,
    paddingTop: spacing.screen.paddingTop,
    paddingBottom: spacing['3xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['4xl'],
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing['5xl'],
  },
  title: {
    fontSize: typography.fontSize['6xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  titleAccent: {
    fontSize: typography.fontSize['6xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.brand.primary,
    textAlign: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing['3xl'],
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.gray[600],
    borderRadius: spacing.radius.lg,
  },
  dayColumnSelected: {
    backgroundColor: colors.brand.primary,
  },
  dayLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  dayLabelSelected: {
    color: '#000000',
  },
  dateContainer: {
    width: 36,
    height: 36,
    backgroundColor: colors.background.elevated,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainerSelected: {
    backgroundColor: '#000000',
  },
  dateText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  infoText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.disabled,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
  },
  bottomSection: {
    marginTop: 'auto',
  },
});

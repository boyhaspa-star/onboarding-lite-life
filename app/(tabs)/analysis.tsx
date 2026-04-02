import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Droplets, Trash2 } from 'lucide-react-native';
import { colors, typography, spacing } from '@/constants/theme';
import { ProgressRing } from '@/components';

const RANGE_OPTIONS = ['Today', 'This Week', 'This Month', 'This Year'] as const;

const WEEK_BARS = [
  { day: 'MON', value: 0.58 },
  { day: 'TUE', value: 0.72 },
  { day: 'WED', value: 1, active: true },
  { day: 'THU', value: 0.5 },
  { day: 'FRI', value: 0.62 },
  { day: 'SAT', value: 0.76 },
  { day: 'SUN', value: 0.42 },
];

const GOALS = [
  {
    id: 'lose-weight',
    title: 'Lose Weight',
    subtitle: 'Lose 1 kg per week',
    progress: 66,
    unit: '%',
    icon: 'trash' as const,
  },
  {
    id: 'drink-water',
    title: 'Drink Water',
    subtitle: '3 liter of water everyday',
    progress: 32,
    unit: '%',
    icon: 'drop' as const,
  },
];

export default function AnalysisScreen() {
  const [range, setRange] = useState<(typeof RANGE_OPTIONS)[number]>('This Week');

  const totalKms = useMemo(() => {
    return 19.86;
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Statistics</Text>
          <Text style={styles.pageSubtitle}>Track your weekly movement and healthy habits</Text>
        </View>

        <View style={styles.chipsRow}>
          {RANGE_OPTIONS.map((option) => {
            const active = option === range;
            return (
              <TouchableOpacity
                key={option}
                activeOpacity={0.9}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setRange(option)}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartDate}>Friday, Oct 14</Text>
          <Text style={styles.chartKcal}>240 kcal</Text>

          <View style={styles.chartBarsRow}>
            {WEEK_BARS.map((bar) => (
              <View key={bar.day} style={styles.barCol}>
                <View
                  style={[
                    styles.bar,
                    { height: 98 * bar.value },
                    bar.active ? styles.barActive : styles.barInactive,
                  ]}
                />
                <Text style={[styles.barLabel, bar.active && styles.barLabelActive]}>{bar.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="STEPS" value="4750" />
          <StatCard label="KM" value={String(totalKms)} />
          <StatCard label="TIME" value="7 hr 5 min" />
        </View>

        <Text style={styles.planHeading}>Healthy Plan</Text>

        <View style={styles.planList}>
          {GOALS.map((goal) => (
            <View key={goal.id} style={styles.planCard}>
              <View style={styles.planIconWrap}>
                {goal.icon === 'trash' ? (
                  <Trash2 size={16} color={colors.text.primary} strokeWidth={1.8} />
                ) : (
                  <Droplets size={16} color={colors.text.primary} strokeWidth={1.8} />
                )}
              </View>

              <View style={styles.planTextWrap}>
                <Text style={styles.planTitle}>{goal.title}</Text>
                <Text style={styles.planSubtitle}>{goal.subtitle}</Text>
              </View>

              <View style={styles.goalRingWrap}>
                <ProgressRing
                  percentage={goal.progress}
                  size={40}
                  strokeWidth={4}
                  showLabel={false}
                  trackColor={colors.overlay.accent8}
                  activeColor={colors.brand.primary}
                />
                <View style={styles.goalRingLabelWrap}>
                  <Text style={styles.goalRingLabel}>{goal.progress}</Text>
                  <Text style={styles.goalRingUnit}>{goal.unit}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing.screen.paddingHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing['6xl'],
  },
  header: {
    marginBottom: spacing.xl,
  },
  pageTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['5xl'],
    marginBottom: spacing.xs,
  },
  pageSubtitle: {
    color: colors.text.disabled,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.body,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    minHeight: 34,
    borderRadius: spacing.radius.md,
    backgroundColor: colors.background.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.overlay.white5,
  },
  chipActive: {
    backgroundColor: colors.overlay.accent20,
    borderColor: colors.brand.primary,
  },
  chipText: {
    color: colors.text.disabled,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
  },
  chipTextActive: {
    color: colors.brand.primary,
    fontFamily: typography.fontFamily.bodyBold,
  },
  chartCard: {
    borderRadius: spacing.radius.lg,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.overlay.white8,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  chartDate: {
    color: colors.text.disabled,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.body,
    marginBottom: spacing.xs,
  },
  chartKcal: {
    color: colors.text.primary,
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bodyBold,
    marginBottom: spacing.md,
  },
  chartBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: '95%',
    minHeight: 28,
    borderRadius: spacing.radius.sm,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  barInactive: {
    backgroundColor: colors.background.muted,
    borderColor: colors.border.default,
  },
  barActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
    shadowColor: colors.brand.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  barLabel: {
    color: colors.text.disabled,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    letterSpacing: 0.4,
  },
  barLabelActive: {
    color: colors.brand.primary,
    fontFamily: typography.fontFamily.bodyBold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: spacing.radius.md,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.overlay.white8,
    paddingHorizontal: spacing.screen.paddingHorizontal,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statLabel: {
    color: colors.text.disabled,
    fontSize: typography.fontSize.sm,
    letterSpacing: 1.2,
    fontFamily: typography.fontFamily.body,
    marginBottom: 6,
  },
  statValue: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize['2xl'],
  },
  planHeading: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['2xl'],
    marginBottom: spacing.md,
  },
  planList: {
    gap: spacing.md,
  },
  planCard: {
    borderRadius: spacing.radius.md,
    backgroundColor: colors.background.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.overlay.white8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  planIconWrap: {
    width: 34,
    height: 34,
    borderRadius: spacing.radius.sm,
    borderWidth: 1,
    borderColor: colors.overlay.accent25,
    backgroundColor: colors.overlay.accent8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  planTextWrap: {
    flex: 1,
    marginRight: spacing.sm,
  },
  planTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xl,
    marginBottom: 2,
  },
  planSubtitle: {
    color: colors.text.disabled,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.body,
  },
  goalRingWrap: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalRingLabelWrap: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  goalRingLabel: {
    color: colors.brand.primary,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 12,
  },
  goalRingUnit: {
    color: colors.brand.primary,
    fontFamily: typography.fontFamily.body,
    fontSize: 8,
    lineHeight: 10,
  },
});

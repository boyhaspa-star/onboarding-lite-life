import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Sparkles, Shuffle, Brain, Zap, Target, Dumbbell } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import BodyView, { ExtendedBodyPart } from 'react-native-body-highlighter';
import AILoader from '@/components/AILoader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Workout metadata
const workoutMeta: Record<string, { title: string; subtitle: string; targetMuscles: ExtendedBodyPart[]; bodySide: 'front' | 'back' }> = {
  '1': {
    title: 'Full Body',
    subtitle: 'Exercise',
    targetMuscles: [
      { slug: 'chest', intensity: 2 },
      { slug: 'deltoids', intensity: 2 },
      { slug: 'biceps', intensity: 2 },
      { slug: 'abs', intensity: 2 },
      { slug: 'quadriceps', intensity: 2 },
    ],
    bodySide: 'front',
  },
  '2': {
    title: 'Chest & Arms',
    subtitle: 'Strength',
    targetMuscles: [
      { slug: 'chest', intensity: 2 },
      { slug: 'deltoids', intensity: 2 },
      { slug: 'biceps', intensity: 2 },
      { slug: 'triceps', intensity: 2 },
    ],
    bodySide: 'front',
  },
  '3': {
    title: 'HIIT Cardio',
    subtitle: 'Fat Burn',
    targetMuscles: [
      { slug: 'quadriceps', intensity: 2 },
      { slug: 'calves', intensity: 2 },
      { slug: 'abs', intensity: 2 },
    ],
    bodySide: 'front',
  },
  '4': {
    title: 'Leg Day',
    subtitle: 'Power',
    targetMuscles: [
      { slug: 'quadriceps', intensity: 2 },
      { slug: 'hamstring', intensity: 2 },
      { slug: 'gluteal', intensity: 2 },
      { slug: 'calves', intensity: 2 },
    ],
    bodySide: 'back',
  },
};

const loadingMessages = [
  'Analyzing your fitness profile...',
  'Optimizing exercise sequence...',
  'Balancing muscle groups...',
  'Customizing rest intervals...',
  'Preparing your best plan...',
];

export default function PreferenceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = workoutMeta[id || '1'];
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSmartPlan = () => {
    setIsLoading(true);
  };

  const handleManual = () => {
    router.push(`/exercises/${id}?mode=manual`);
  };

  const handleSmartPlanComplete = () => {
    router.replace(`/exercises/${id}?mode=smart`);
  };

  if (isLoading) {
    return (
      <AILoader
        title="Customizing Your Plan"
        messages={loadingMessages}
        icon={<Brain size={48} color="#CDFC00" />}
        onComplete={handleSmartPlanComplete}
        duration={3000}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle}>{workout.title}</Text>
          <Text style={styles.headerSubtitle}>{workout.subtitle}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Body Preview */}
      <View style={styles.bodyPreview}>
        <BodyView
          data={workout.targetMuscles}
          gender="female"
          side={workout.bodySide}
          scale={0.7}
          // colors={['#F5A962', '#E9A45C']}
          colors={['#CDFC00', '#CDFC00']}     
        />
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>How would you like</Text>
        <Text style={styles.mainTitle}>to train today?</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {/* Smart Plan Option */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleSmartPlan}
          activeOpacity={0.9}>
          <View style={styles.optionCardBorder}>
            <Svg width="100%" height="100%" viewBox="0 0 343 140" preserveAspectRatio="none">
              <Defs>
                <LinearGradient id="smartBorder" x1="0" y1="0" x2="343" y2="140">
                  <Stop offset="0" stopColor="#CDFC00" stopOpacity="0.6" />
                  <Stop offset="1" stopColor="#CDFC00" stopOpacity="0.1" />
                </LinearGradient>
              </Defs>
              <Path
                d="M16 0C7.163 0 0 7.163 0 16V124C0 132.837 7.163 140 16 140H327C335.837 140 343 132.837 343 124V16C343 7.163 335.837 0 327 0H16Z"
                fill="rgba(205, 252, 0, 0.08)"
                stroke="url(#smartBorder)"
                strokeWidth="1.5"
              />
            </Svg>
          </View>

          <View style={styles.optionContent}>
            <View style={styles.optionIconContainer}>
              <View style={styles.optionIconBg}>
                <Sparkles size={28} color="#CDFC00" />
              </View>
            </View>
            <View style={styles.optionTextArea}>
              <View style={styles.optionTitleRow}>
                <Text style={styles.optionTitle}>Smart Plan</Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Recommended</Text>
                </View>
              </View>
              <Text style={styles.optionDescription}>
                AI-optimized sequence based on your fitness level and goals
              </Text>
              <View style={styles.optionFeatures}>
                <View style={styles.featureItem}>
                  <Target size={12} color="#CDFC00" />
                  <Text style={styles.featureText}>Personalized</Text>
                </View>
                <View style={styles.featureItem}>
                  <Zap size={12} color="#CDFC00" />
                  <Text style={styles.featureText}>Optimized</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Manual Option */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleManual}
          activeOpacity={0.9}>
          <View style={styles.optionCardBorder}>
            <Svg width="100%" height="100%" viewBox="0 0 343 140" preserveAspectRatio="none">
              <Defs>
                <LinearGradient id="manualBorder" x1="0" y1="0" x2="343" y2="140">
                  <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.3" />
                  <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.05" />
                </LinearGradient>
              </Defs>
              <Path
                d="M16 0C7.163 0 0 7.163 0 16V124C0 132.837 7.163 140 16 140H327C335.837 140 343 132.837 343 124V16C343 7.163 335.837 0 327 0H16Z"
                fill="rgba(255, 255, 255, 0.03)"
                stroke="url(#manualBorder)"
                strokeWidth="1"
              />
            </Svg>
          </View>

          <View style={styles.optionContent}>
            <View style={styles.optionIconContainer}>
              <View style={[styles.optionIconBg, styles.optionIconBgManual]}>
                <Shuffle size={28} color="#888888" />
              </View>
            </View>
            <View style={styles.optionTextArea}>
              <Text style={[styles.optionTitle, styles.optionTitleManual]}>Manual Mode</Text>
              <Text style={styles.optionDescription}>
                Browse all exercises and pick your own workout flow
              </Text>
              <View style={styles.optionFeatures}>
                <View style={styles.featureItem}>
                  <Dumbbell size={12} color="#666666" />
                  <Text style={[styles.featureText, styles.featureTextManual]}>Full Control</Text>
                </View>
              </View>
            </View>
          </View>
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
    fontSize: 18,
    fontFamily: 'Audiowide',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  headerSpacer: {
    width: 44,
  },
  // Body Preview
  bodyPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 10,
  },
  // Title
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontFamily: 'Audiowide',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Options
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  optionCard: {
    height: 140,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  optionCardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  optionIconContainer: {
    justifyContent: 'center',
  },
  optionIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(205, 252, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIconBgManual: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  optionTextArea: {
    flex: 1,
    justifyContent: 'center',
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  optionTitle: {
    fontSize: 20,
    fontFamily: 'Audiowide',
    color: '#CDFC00',
  },
  optionTitleManual: {
    color: '#FFFFFF',
    marginBottom: 6,
  },
  recommendedBadge: {
    backgroundColor: 'rgba(205, 252, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#CDFC00',
    textTransform: 'uppercase',
  },
  optionDescription: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 18,
    marginBottom: 10,
  },
  optionFeatures: {
    flexDirection: 'row',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 11,
    color: '#CDFC00',
    fontWeight: '500',
  },
  featureTextManual: {
    color: '#666666',
  },
});

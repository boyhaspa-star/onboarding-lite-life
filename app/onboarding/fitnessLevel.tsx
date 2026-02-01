import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | null;

const fitnessLevels = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: "I'm new to fitness",
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'I work out from time to time',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'I exercise regularly',
  },
];

export default function FitnessLevelScreen() {
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel>(null);
  
  // Animation refs for each card
  const scaleAnims = useRef(
    fitnessLevels.map(() => new Animated.Value(1))
  ).current;

  const handlePressIn = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handleSelect = (id: string, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLevel(id as FitnessLevel);
  };

  const handleContinue = () => {
    if (selectedLevel) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/onboarding/bodyParts');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Progress dots */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>What's your</Text>
          <Text style={styles.titleAccent}>fitness level?</Text>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          {fitnessLevels.map((level, index) => {
            const isSelected = selectedLevel === level.id;

            return (
              <Animated.View
                key={level.id}
                style={[
                  { transform: [{ scale: scaleAnims[index] }] },
                ]}
              >
                <Pressable
                  onPressIn={() => handlePressIn(index)}
                  onPressOut={() => handlePressOut(index)}
                  onPress={() => handleSelect(level.id, index)}
                  style={[
                    styles.card,
                    isSelected && styles.cardSelected,
                  ]}
                >
                  <Text style={styles.cardTitle}>{level.title}</Text>
                  <Text style={styles.cardDescription}>{level.description}</Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedLevel && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedLevel}
            activeOpacity={0.85}
          >
            <Text style={[
              styles.continueButtonText,
              !selectedLevel && styles.continueButtonTextDisabled,
            ]}>
              Next
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
    backgroundColor: '#1A1A1A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
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
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Audiowide',
    color: '#FFFFFF',
  },
  titleAccent: {
    fontSize: 32,
    fontFamily: 'Audiowide',
    color: '#FF6B35',
  },
  cardsContainer: {
    flex: 1,
    gap: 16,
  },
  card: {
    backgroundColor: 'rgba(60, 60, 60, 0.5)',
    borderRadius: 20,
    padding: 24,
    minHeight: 110,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardSelected: {
    borderColor: '#CDFC00',
    borderWidth: 2,
    backgroundColor: 'rgba(205, 252, 0, 0.05)',
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Averta-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Averta',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  bottomSection: {
    marginTop: 24,
  },
  continueButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#3A3A3A',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Averta-Bold',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#666666',
  },
});

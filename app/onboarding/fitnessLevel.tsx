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
import { ChevronLeft } from 'lucide-react-native';
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={28} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
          </View>
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
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
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
    marginRight: 44, // Balance the back button
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
  cardsContainer: {
    flex: 1,
    gap: 16,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    minHeight: 110,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#CDFC00',
    backgroundColor: '#1A1A1A',
    shadowColor: '#CDFC00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#888888',
    fontWeight: '400',
  },
  bottomSection: {
    marginTop: 24,
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

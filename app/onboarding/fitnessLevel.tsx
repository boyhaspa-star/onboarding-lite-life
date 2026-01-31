import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Circle, CheckCircle2 } from 'lucide-react-native';

type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | null;

const fitnessLevels = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'Just starting my fitness journey',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Have some workout experience',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Training regularly for years',
  },
];

export default function FitnessLevelScreen() {
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel>(null);
  const { width } = Dimensions.get('window');

  const handleContinue = () => {
    if (selectedLevel) {
      router.push('/onboarding/bodyParts');
    }
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
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>
            <Text style={styles.pageIndicator}>3 of 4</Text>
          </View>

          <View style={styles.heroSection}>
            <View style={styles.heroImageWrapper}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
                style={styles.heroGradient}
              />
            </View>

            <View style={styles.heroTextOverlay}>
              <Text style={styles.heroMainText}>
                <Text style={styles.highlightText}>Kick</Text>
              </Text>
              <Text style={styles.heroSecondaryText}>Boxing</Text>
              <Text style={styles.heroSecondaryText}>
                <Text style={styles.highlightText}>Weightlift</Text>
              </Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.title}>What's your fitness level?</Text>
            <Text style={styles.subtitle}>This helps us personalize your workout</Text>
          </View>

          <View style={styles.optionsContainer}>
            {fitnessLevels.map((level) => {
              const isSelected = selectedLevel === level.id;

              return (
                <TouchableOpacity
                  key={level.id}
                  onPress={() => setSelectedLevel(level.id as FitnessLevel)}
                  activeOpacity={0.8}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}>
                  <View style={styles.radioContainer}>
                    {isSelected ? (
                      <CheckCircle2 size={24} color="#CDFC00" fill="#CDFC00" />
                    ) : (
                      <Circle size={24} color="#555555" strokeWidth={2} />
                    )}
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && styles.optionTitleSelected,
                      ]}>
                      {level.title}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {level.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !selectedLevel && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!selectedLevel}
              activeOpacity={0.85}>
              <Text style={styles.continueButtonText}>Continue</Text>
              <ArrowRight
                size={20}
                color={selectedLevel ? '#000000' : '#666666'}
              />
            </TouchableOpacity>
          </View>
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
    marginBottom: 28,
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
    backgroundColor: '#CDFC00',
    borderRadius: 2,
  },
  pageIndicator: {
    color: '#999999',
    fontSize: 12,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 24,
  },
  heroSection: {
    marginBottom: 28,
    borderRadius: 20,
    overflow: 'hidden',
    height: 200,
    position: 'relative',
  },
  heroImageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  heroTextOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  heroMainText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 52,
  },
  heroSecondaryText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 52,
  },
  highlightText: {
    color: '#CDFC00',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999999',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: '#333333',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(205, 252, 0, 0.08)',
    borderColor: '#CDFC00',
  },
  radioContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: '#FFFFFF',
  },
  optionDescription: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '400',
  },
  bottomSection: {
    gap: 12,
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
  continueButtonDisabled: {
    backgroundColor: '#333333',
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
});

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Zap, Activity, Target } from 'lucide-react-native';

type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | null;

const fitnessLevels = [
  {
    id: 'beginner',
    icon: Activity,
    title: 'Beginner',
    description: 'Just starting my fitness journey',
    color: '#3B82F6',
  },
  {
    id: 'intermediate',
    icon: Zap,
    title: 'Intermediate',
    description: 'Have some workout experience',
    color: '#22c55e',
  },
  {
    id: 'advanced',
    icon: Target,
    title: 'Advanced',
    description: 'Training regularly for years',
    color: '#F59E0B',
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

          <View style={styles.formSection}>
            <Text style={styles.title}>What's your fitness level?</Text>
            <Text style={styles.subtitle}>This helps us personalize your workout</Text>
          </View>

          <ScrollView
            style={styles.cardsContainer}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}>
            {fitnessLevels.map((level) => {
              const IconComponent = level.icon;
              const isSelected = selectedLevel === level.id;

              return (
                <TouchableOpacity
                  key={level.id}
                  onPress={() => setSelectedLevel(level.id as FitnessLevel)}
                  activeOpacity={0.8}
                  style={[
                    styles.card,
                    isSelected && styles.cardSelected,
                    {
                      borderColor: isSelected ? level.color : '#333333',
                      backgroundColor: isSelected
                        ? `${level.color}15`
                        : 'rgba(255, 255, 255, 0.03)',
                    },
                  ]}>
                  <View style={styles.cardHeader}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: `${level.color}20` },
                      ]}>
                      <IconComponent
                        size={28}
                        color={level.color}
                        strokeWidth={2.5}
                      />
                    </View>
                    <View style={styles.cardTitleContainer}>
                      <Text style={styles.cardTitle}>{level.title}</Text>
                      <Text style={styles.cardDescription}>
                        {level.description}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.cardIndicator,
                      isSelected && { backgroundColor: level.color },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

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
    backgroundColor: '#22c55e',
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
  cardsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardSelected: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: '#999999',
  },
  cardIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333333',
    marginLeft: 12,
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

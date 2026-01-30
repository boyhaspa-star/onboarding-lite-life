import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Check } from 'lucide-react-native';
import BodyView from 'react-native-body-highlighter';

type MuscleGroup = {
  id: string;
  name: string;
  category: 'upper' | 'core' | 'lower';
  side: 'front' | 'back' | 'both';
  bodyParts: Array<{ slug: string; intensity: number; side?: 'left' | 'right' }>;
};

const muscleGroups: MuscleGroup[] = [
  // Upper Body - Front
  {
    id: 'chest',
    name: 'Chest',
    category: 'upper',
    side: 'front',
    bodyParts: [{ slug: 'chest', intensity: 2 }],
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    category: 'upper',
    side: 'front',
    bodyParts: [{ slug: 'deltoids', intensity: 2 }],
  },
  {
    id: 'biceps',
    name: 'Biceps',
    category: 'upper',
    side: 'front',
    bodyParts: [{ slug: 'biceps', intensity: 2 }],
  },
  {
    id: 'forearms',
    name: 'Forearms',
    category: 'upper',
    side: 'front',
    bodyParts: [{ slug: 'forearm', intensity: 2 }],
  },
  // Upper Body - Both
  {
    id: 'trapezius',
    name: 'Traps',
    category: 'upper',
    side: 'both',
    bodyParts: [{ slug: 'trapezius', intensity: 2 }],
  },
  // Upper Body - Back
  {
    id: 'triceps',
    name: 'Triceps',
    category: 'upper',
    side: 'back',
    bodyParts: [{ slug: 'triceps', intensity: 2 }],
  },
  {
    id: 'upper-back',
    name: 'Upper Back',
    category: 'upper',
    side: 'back',
    bodyParts: [{ slug: 'upper-back', intensity: 2 }],
  },
  {
    id: 'lower-back',
    name: 'Lower Back',
    category: 'upper',
    side: 'back',
    bodyParts: [{ slug: 'lower-back', intensity: 2 }],
  },
  // Core - Front
  {
    id: 'abs',
    name: 'Abs',
    category: 'core',
    side: 'front',
    bodyParts: [{ slug: 'abs', intensity: 2 }],
  },
  {
    id: 'obliques',
    name: 'Obliques',
    category: 'core',
    side: 'front',
    bodyParts: [{ slug: 'obliques', intensity: 2 }],
  },
  // Lower Body - Front
  {
    id: 'quadriceps',
    name: 'Quads',
    category: 'lower',
    side: 'front',
    bodyParts: [{ slug: 'quadriceps', intensity: 2 }],
  },
  {
    id: 'adductors',
    name: 'Adductors',
    category: 'lower',
    side: 'front',
    bodyParts: [{ slug: 'adductors', intensity: 2 }],
  },
  // Lower Body - Back
  {
    id: 'hamstrings',
    name: 'Hamstrings',
    category: 'lower',
    side: 'back',
    bodyParts: [{ slug: 'hamstring', intensity: 2 }],
  },
  {
    id: 'glutes',
    name: 'Glutes',
    category: 'lower',
    side: 'back',
    bodyParts: [{ slug: 'gluteal', intensity: 2 }],
  },
  {
    id: 'calves',
    name: 'Calves',
    category: 'lower',
    side: 'both',
    bodyParts: [{ slug: 'calves', intensity: 2 }],
  },
];

export default function BodyPartsScreen() {
  const [selectedMuscles, setSelectedMuscles] = useState<Set<string>>(new Set());
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');

  const toggleMuscle = (id: string) => {
    const newSelected = new Set(selectedMuscles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMuscles(newSelected);
  };

  const toggleView = () => {
    setViewSide((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const getHighlightedParts = () => {
    const parts: Array<{ slug: string; intensity: number; side?: 'left' | 'right' }> = [];
    muscleGroups.forEach((group) => {
      if (selectedMuscles.has(group.id)) {
        parts.push(...group.bodyParts);
      }
    });
    return parts;
  };

  const groupedMuscles = {
    upper: muscleGroups.filter((m) => m.category === 'upper' && (m.side === viewSide || m.side === 'both')),
    core: muscleGroups.filter((m) => m.category === 'core' && (m.side === viewSide || m.side === 'both')),
    lower: muscleGroups.filter((m) => m.category === 'lower' && (m.side === viewSide || m.side === 'both')),
  };

  const handleContinue = () => {
    if (selectedMuscles.size > 0) {
      router.push('/onboarding/complete');
    }
  };

  const renderMuscleButton = (muscle: MuscleGroup) => (
    <TouchableOpacity
      key={muscle.id}
      style={[
        styles.muscleButton,
        selectedMuscles.has(muscle.id) && styles.muscleButtonSelected,
      ]}
      onPress={() => toggleMuscle(muscle.id)}
      activeOpacity={0.7}>
      <View
        style={[
          styles.checkbox,
          selectedMuscles.has(muscle.id) && styles.checkboxSelected,
        ]}>
        {selectedMuscles.has(muscle.id) && (
          <Check size={12} color="#000000" strokeWidth={3} />
        )}
      </View>
      <Text
        style={[
          styles.muscleText,
          selectedMuscles.has(muscle.id) && styles.muscleTextSelected,
        ]}>
        {muscle.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '80%' }]} />
          </View>
          <Text style={styles.pageIndicator}>4 of 5</Text>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>Target muscle groups</Text>
          <Text style={styles.subtitle}>Select the areas you want to focus on</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.leftPanel}>
            <ScrollView style={styles.muscleList} showsVerticalScrollIndicator={false}>
              <View style={styles.categorySection}>
                <Text style={styles.categoryTitle}>UPPER BODY</Text>
                {groupedMuscles.upper.map(renderMuscleButton)}
              </View>

              <View style={styles.categorySection}>
                <Text style={styles.categoryTitle}>CORE</Text>
                {groupedMuscles.core.map(renderMuscleButton)}
              </View>

              <View style={styles.categorySection}>
                <Text style={styles.categoryTitle}>LOWER BODY</Text>
                {groupedMuscles.lower.map(renderMuscleButton)}
              </View>
            </ScrollView>
          </View>

          <View style={styles.rightPanel}>
            <View style={styles.bodyViewContainer}>
              <BodyView
                data={getHighlightedParts()}
                gender="male"
                side={viewSide}
                scale={1.2}
                colors={['#86efac', '#E6FE58']}
              />
            </View>

            <TouchableOpacity
              style={styles.rotateButton}
              onPress={toggleView}
              activeOpacity={0.7}>
              <Text style={styles.rotateEmoji}>🔄</Text>
              <Text style={styles.rotateText}>
                {viewSide === 'front' ? 'Back' : 'Front'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.selectionCount}>
            {selectedMuscles.size} {selectedMuscles.size === 1 ? 'area' : 'areas'} selected
          </Text>
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedMuscles.size === 0 && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={selectedMuscles.size === 0}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 8,
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
    backgroundColor: '#E6FE58',
    borderRadius: 2,
  },
  pageIndicator: {
    color: '#999999',
    fontSize: 12,
    fontWeight: '500',
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999999',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  leftPanel: {
    flex: 1,
  },
  muscleList: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryTitle: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
    marginLeft: 4,
  },
  muscleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  muscleButtonSelected: {
    borderColor: '#E6FE58',
    backgroundColor: 'rgba(230, 254, 88, 0.1)',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#555555',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#E6FE58',
    borderColor: '#E6FE58',
  },
  muscleText: {
    color: '#cccccc',
    fontSize: 13,
    fontWeight: '500',
  },
  muscleTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  rightPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bodyViewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateButton: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 254, 88, 0.15)',
    borderWidth: 1,
    borderColor: '#E6FE58',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
  rotateEmoji: {
    fontSize: 14,
  },
  rotateText: {
    color: '#E6FE58',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
  },
  selectionCount: {
    color: '#999999',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
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
    shadowColor: '#E6FE58',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
  continueButtonDisabled: {
    backgroundColor: '#333333',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
});

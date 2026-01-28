import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BodyView from 'react-native-body-highlighter';
import { Check } from 'lucide-react-native';

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
  {
    id: 'neck',
    name: 'Neck',
    category: 'core',
    side: 'front',
    bodyParts: [{ slug: 'neck', intensity: 2 }],
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

export default function WorkoutScreen() {
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

  const selectAll = () => {
    setSelectedMuscles(new Set(muscleGroups.map((g) => g.id)));
  };

  const deselectAll = () => {
    setSelectedMuscles(new Set());
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
          <Check size={14} color="#000000" strokeWidth={3} />
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.leftPanel}>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={selectAll} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={deselectAll} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

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

          <TouchableOpacity style={styles.finishButton}>
            <Text style={styles.finishButtonText}>Finished</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightPanel}>
          <View style={styles.bodyViewContainer}>
            <BodyView
              data={getHighlightedParts()}
              gender="male"
              side={viewSide}
              scale={1.5}
              colors={['#86efac', '#22c55e']}
            />
          </View>

          <TouchableOpacity
            style={styles.rotateButton}
            onPress={toggleView}
            activeOpacity={0.7}>
            <Text style={styles.rotateEmoji}>🔄</Text>
            <Text style={styles.rotateText}>
              {viewSide === 'front' ? 'Show Back' : 'Show Front'}
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
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  leftPanel: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  muscleList: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    color: '#666666',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  muscleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  muscleButtonSelected: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555555',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  muscleText: {
    color: '#cccccc',
    fontSize: 15,
    fontWeight: '500',
  },
  muscleTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#22c55e',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  finishButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
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
    bottom: 20,
    alignSelf: 'center',
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#22c55e',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rotateEmoji: {
    fontSize: 20,
  },
  rotateText: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: '700',
  },
});

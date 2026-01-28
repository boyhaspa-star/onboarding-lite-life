import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BodyView from 'react-native-body-highlighter';
import { Check } from 'lucide-react-native';

type MuscleGroup = {
  id: string;
  name: string;
  category: 'upper' | 'core' | 'lower';
  bodyParts: Array<{ slug: string; intensity: number; side?: 'left' | 'right' }>;
};

const muscleGroups: MuscleGroup[] = [
  // Upper Body
  {
    id: 'chest',
    name: 'Chest',
    category: 'upper',
    bodyParts: [{ slug: 'chest', intensity: 2 }],
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    category: 'upper',
    bodyParts: [
      { slug: 'deltoids', intensity: 2, side: 'left' },
      { slug: 'deltoids', intensity: 2, side: 'right' },
    ],
  },
  {
    id: 'trapezius',
    name: 'Traps',
    category: 'upper',
    bodyParts: [
      { slug: 'trapezius', intensity: 2, side: 'left' },
      { slug: 'trapezius', intensity: 2, side: 'right' },
    ],
  },
  {
    id: 'biceps',
    name: 'Biceps',
    category: 'upper',
    bodyParts: [
      { slug: 'biceps', intensity: 2, side: 'left' },
      { slug: 'biceps', intensity: 2, side: 'right' },
    ],
  },
  {
    id: 'triceps',
    name: 'Triceps',
    category: 'upper',
    bodyParts: [
      { slug: 'triceps', intensity: 2, side: 'left' },
      { slug: 'triceps', intensity: 2, side: 'right' },
    ],
  },
  {
    id: 'forearms',
    name: 'Forearms',
    category: 'upper',
    bodyParts: [
      { slug: 'forearm', intensity: 2, side: 'left' },
      { slug: 'forearm', intensity: 2, side: 'right' },
    ],
  },
  {
    id: 'upper-back',
    name: 'Upper Back',
    category: 'upper',
    bodyParts: [{ slug: 'upper-back', intensity: 2 }],
  },
  {
    id: 'lower-back',
    name: 'Lower Back',
    category: 'upper',
    bodyParts: [{ slug: 'lower-back', intensity: 2 }],
  },
  // Core
  {
    id: 'abs',
    name: 'Abs',
    category: 'core',
    bodyParts: [{ slug: 'abs', intensity: 2 }],
  },
  {
    id: 'obliques',
    name: 'Obliques',
    category: 'core',
    bodyParts: [
      { slug: 'obliques', intensity: 2, side: 'left' },
      { slug: 'obliques', intensity: 2, side: 'right' },
    ],
  },
  {
    id: 'neck',
    name: 'Neck',
    category: 'core',
    bodyParts: [{ slug: 'neck', intensity: 2 }],
  },
  // Lower Body
  {
    id: 'quadriceps',
    name: 'Quads',
    category: 'lower',
    bodyParts: [
      { slug: 'quadriceps', intensity: 2, side: 'left' },
      { slug: 'quadriceps', intensity: 2, side: 'right' },
    ],
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings',
    category: 'lower',
    bodyParts: [
      { slug: 'hamstring', intensity: 2, side: 'left' },
      { slug: 'hamstring', intensity: 2, side: 'right' },
    ],
  },
  {
    id: 'glutes',
    name: 'Glutes',
    category: 'lower',
    bodyParts: [
      { slug: 'gluteal', intensity: 2, side: 'left' },
      { slug: 'gluteal', intensity: 2, side: 'right' },
    ],
  },
  {
    id: 'calves',
    name: 'Calves',
    category: 'lower',
    bodyParts: [
      { slug: 'calves', intensity: 2, side: 'left' },
      { slug: 'calves', intensity: 2, side: 'right' },
    ],
  },
  {
    id: 'adductors',
    name: 'Adductors',
    category: 'lower',
    bodyParts: [
      { slug: 'adductors', intensity: 2, side: 'left' },
      { slug: 'adductors', intensity: 2, side: 'right' },
    ],
  },
];

export default function WorkoutScreen() {
  const [selectedMuscles, setSelectedMuscles] = useState<Set<string>>(new Set());

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
    upper: muscleGroups.filter((m) => m.category === 'upper'),
    core: muscleGroups.filter((m) => m.category === 'core'),
    lower: muscleGroups.filter((m) => m.category === 'lower'),
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
          <BodyView
            data={getHighlightedParts()}
            gender="male"
            side="front"
            scale={1.5}
            colors={['#86efac', '#22c55e']}
          />
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
  },
});

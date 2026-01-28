import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BodyView from 'react-native-body-highlighter';
import { Check } from 'lucide-react-native';

type MuscleGroup = {
  id: string;
  name: string;
  bodyParts: Array<{ slug: string; intensity: number }>;
};

const muscleGroups: MuscleGroup[] = [
  {
    id: 'shoulder',
    name: 'Shoulder',
    bodyParts: [
      { slug: 'left-shoulder', intensity: 2 },
      { slug: 'right-shoulder', intensity: 2 },
    ],
  },
  {
    id: 'triceps',
    name: 'Triceps',
    bodyParts: [
      { slug: 'left-triceps', intensity: 2 },
      { slug: 'right-triceps', intensity: 2 },
    ],
  },
  {
    id: 'biceps',
    name: 'Biceps',
    bodyParts: [
      { slug: 'left-biceps', intensity: 2 },
      { slug: 'right-biceps', intensity: 2 },
    ],
  },
  {
    id: 'chest',
    name: 'Chest',
    bodyParts: [{ slug: 'chest', intensity: 2 }],
  },
  {
    id: 'neck',
    name: 'Neck',
    bodyParts: [{ slug: 'neck', intensity: 2 }],
  },
  {
    id: 'legs',
    name: 'Legs',
    bodyParts: [
      { slug: 'left-leg', intensity: 2 },
      { slug: 'right-leg', intensity: 2 },
      { slug: 'left-knee', intensity: 2 },
      { slug: 'right-knee', intensity: 2 },
    ],
  },
  {
    id: 'abs',
    name: 'Abs',
    bodyParts: [{ slug: 'abs', intensity: 2 }],
  },
];

export default function WorkoutScreen() {
  const [selectedMuscles, setSelectedMuscles] = useState<Set<string>>(new Set(['shoulder']));

  const toggleMuscle = (id: string) => {
    const newSelected = new Set(selectedMuscles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMuscles(newSelected);
  };

  const getHighlightedParts = () => {
    const parts: Array<{ slug: string; intensity: number }> = [];
    muscleGroups.forEach((group) => {
      if (selectedMuscles.has(group.id)) {
        parts.push(...group.bodyParts);
      }
    });
    return parts;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.leftPanel}>
          <ScrollView style={styles.muscleList} showsVerticalScrollIndicator={false}>
            {muscleGroups.map((muscle) => (
              <TouchableOpacity
                key={muscle.id}
                style={[
                  styles.muscleButton,
                  selectedMuscles.has(muscle.id) && styles.muscleButtonSelected,
                ]}
                onPress={() => toggleMuscle(muscle.id)}>
                <View
                  style={[
                    styles.checkbox,
                    selectedMuscles.has(muscle.id) && styles.checkboxSelected,
                  ]}>
                  {selectedMuscles.has(muscle.id) && (
                    <Check size={16} color="#000000" strokeWidth={3} />
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
            ))}
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
            colors={['#c6ff00']}
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
  },
  leftPanel: {
    flex: 1,
    justifyContent: 'space-between',
  },
  muscleList: {
    flex: 1,
  },
  muscleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  muscleButtonSelected: {
    borderColor: '#c6ff00',
    backgroundColor: 'rgba(198, 255, 0, 0.05)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666666',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#c6ff00',
    borderColor: '#c6ff00',
  },
  muscleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  muscleTextSelected: {
    color: '#ffffff',
  },
  finishButton: {
    backgroundColor: '#c6ff00',
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

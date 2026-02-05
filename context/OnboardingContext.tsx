import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Slug } from 'react-native-body-highlighter';

type BodyPart = {
  slug: Slug;
  intensity: number;
  side?: 'left' | 'right';
};

type MuscleGroup = {
  id: string;
  name: string;
  category: 'upper' | 'core' | 'lower';
  side: 'front' | 'back' | 'both';
  bodyParts: BodyPart[];
};

type OnboardingData = {
  gender: 'male' | 'female' | null;
  selectedMuscles: Set<string>;
  fitnessLevel: string | null;
  age: number | null;
};

type OnboardingContextType = {
  data: OnboardingData;
  setGender: (gender: 'male' | 'female') => void;
  setSelectedMuscles: (muscles: Set<string>) => void;
  setFitnessLevel: (level: string) => void;
  setAge: (age: number) => void;
};

const defaultData: OnboardingData = {
  gender: 'male',
  selectedMuscles: new Set(['chest', 'abs', 'biceps']), // Default selections for demo
  fitnessLevel: null,
  age: null,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  const setGender = (gender: 'male' | 'female') => {
    setData(prev => ({ ...prev, gender }));
  };

  const setSelectedMuscles = (muscles: Set<string>) => {
    setData(prev => ({ ...prev, selectedMuscles: muscles }));
  };

  const setFitnessLevel = (level: string) => {
    setData(prev => ({ ...prev, fitnessLevel: level }));
  };

  const setAge = (age: number) => {
    setData(prev => ({ ...prev, age }));
  };

  return (
    <OnboardingContext.Provider value={{ 
      data, 
      setGender, 
      setSelectedMuscles, 
      setFitnessLevel, 
      setAge 
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

// Muscle groups data (shared)
export const muscleGroups: MuscleGroup[] = [
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

export function getHighlightedPartsFromSelection(selectedMuscles: Set<string>): BodyPart[] {
  const parts: BodyPart[] = [];
  muscleGroups.forEach((group) => {
    if (selectedMuscles.has(group.id)) {
      parts.push(...group.bodyParts);
    }
  });
  return parts;
}

export function getSelectedMuscleNames(selectedMuscles: Set<string>) {
  return muscleGroups
    .filter(g => selectedMuscles.has(g.id))
    .map(g => g.name);
}

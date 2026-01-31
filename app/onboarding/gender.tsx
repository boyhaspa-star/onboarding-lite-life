import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, UserRound } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Gender = 'male' | 'female' | null;

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender>(null);
  
  // Animation refs
  const maleScale = useRef(new Animated.Value(1)).current;
  const femaleScale = useRef(new Animated.Value(1)).current;
  const maleGlow = useRef(new Animated.Value(0)).current;
  const femaleGlow = useRef(new Animated.Value(0)).current;

  const handlePressIn = (gender: 'male' | 'female') => {
    const scale = gender === 'male' ? maleScale : femaleScale;
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = (gender: 'male' | 'female') => {
    const scale = gender === 'male' ? maleScale : femaleScale;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handleSelect = (gender: 'male' | 'female') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedGender(gender);
    
    // Animate glow
    const selectedGlow = gender === 'male' ? maleGlow : femaleGlow;
    const otherGlow = gender === 'male' ? femaleGlow : maleGlow;
    
    Animated.parallel([
      Animated.timing(selectedGlow, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(otherGlow, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleContinue = () => {
    if (selectedGender) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/onboarding/age');
    }
  };

  const renderGenderCard = (
    gender: 'male' | 'female',
    label: string,
    scale: Animated.Value,
    glow: Animated.Value
  ) => {
    const isSelected = selectedGender === gender;
    const IconComponent = gender === 'male' ? User : UserRound;

    const borderColor = glow.interpolate({
      inputRange: [0, 1],
      outputRange: ['#2A2A2A', '#CDFC00'],
    });

    const shadowOpacity = glow.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
    });

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <Pressable
          onPressIn={() => handlePressIn(gender)}
          onPressOut={() => handlePressOut(gender)}
          onPress={() => handleSelect(gender)}
          style={styles.cardPressable}
        >
          <Animated.View
            style={[
              styles.card,
              {
                borderColor,
                shadowOpacity,
              },
            ]}
          >
            {/* Character silhouette area */}
            <View style={styles.characterContainer}>
              <View style={[
                styles.characterCircle,
                isSelected && styles.characterCircleSelected,
              ]}>
                <IconComponent
                  size={80}
                  color={isSelected ? '#CDFC00' : '#666666'}
                  strokeWidth={1.5}
                />
              </View>
            </View>
            
            {/* Label */}
            <Text style={[
              styles.cardLabel,
              isSelected && styles.cardLabelSelected,
            ]}>
              {label}
            </Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>What's your</Text>
          <Text style={styles.titleAccent}>gender?</Text>
        </View>

        {/* Gender Cards */}
        <View style={styles.cardsContainer}>
          {renderGenderCard('male', 'Male', maleScale, maleGlow)}
          {renderGenderCard('female', 'Female', femaleScale, femaleGlow)}
        </View>

        {/* Tip text */}
        <Text style={styles.tipText}>
          This helps us personalize your workout experience
        </Text>

        {/* Bottom Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedGender && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedGender}
            activeOpacity={0.85}
          >
            <Text style={[
              styles.continueButtonText,
              !selectedGender && styles.continueButtonTextDisabled,
            ]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const CARD_WIDTH = (SCREEN_WIDTH - 64) / 2;

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
    alignItems: 'center',
    marginBottom: 48,
    paddingTop: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  cardPressable: {
    width: '100%',
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#CDFC00',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 8,
  },
  characterContainer: {
    marginBottom: 20,
  },
  characterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterCircleSelected: {
    backgroundColor: 'rgba(205, 252, 0, 0.1)',
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888888',
  },
  cardLabelSelected: {
    color: '#FFFFFF',
  },
  tipText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  bottomSection: {
    marginTop: 'auto',
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

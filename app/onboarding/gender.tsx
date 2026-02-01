import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Gender = 'male' | 'female' | null;

// Male icon component
const MaleIcon = ({ color = '#FFFFFF', size = 48 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10 9C10 10.0609 9.57857 11.0783 8.82843 11.8284C8.07828 12.5786 7.06087 13 6 13C4.93913 13 3.92172 12.5786 3.17157 11.8284C2.42143 11.0783 2 10.0609 2 9C2 7.93913 2.42143 6.92172 3.17157 6.17157C3.92172 5.42143 4.93913 5 6 5C7.06087 5 8.07828 5.42143 8.82843 6.17157C9.57857 6.92172 10 7.93913 10 9Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 13L15 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 7H15V10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Female icon component
const FemaleIcon = ({ color = '#FFFFFF', size = 48 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15C14.7614 15 17 12.7614 17 10C17 7.23858 14.7614 5 12 5C9.23858 5 7 7.23858 7 10C7 12.7614 9.23858 15 12 15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 15V22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 19H15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender>(null);

  const handleSelect = (gender: 'male' | 'female') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedGender(gender);
  };

  const handleContinue = () => {
    if (selectedGender) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/onboarding/age');
    }
  };

  const isMaleSelected = selectedGender === 'male';
  const isFemaleSelected = selectedGender === 'female';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Progress dots */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Good day</Text>
          <Text style={styles.titleAccent}>healthy body</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          With this app you can try different types of activities and choose the most enjoyable for you.
        </Text>

        {/* Gender Selection - S-shaped centered SVG */}
        <View style={styles.genderContainer}>
          <View style={styles.svgWrapper}>
            {/* Left Panel - Male */}
            <TouchableOpacity
              style={[
                styles.malePanel,
                isMaleSelected && styles.panelSelected,
              ]}
              onPress={() => handleSelect('male')}
              activeOpacity={0.8}
            >
              <View style={styles.genderContent}>
                <MaleIcon 
                  color={isMaleSelected ? '#CDFC00' : '#666666'} 
                  size={48} 
                />
                <Text style={[
                  styles.genderLabel,
                  isMaleSelected && styles.genderLabelSelected,
                ]}>
                  Male
                </Text>
              </View>
            </TouchableOpacity>

            {/* Right Panel - Female */}
            <TouchableOpacity
              style={[
                styles.femalePanel,
                isFemaleSelected && styles.panelSelected,
              ]}
              onPress={() => handleSelect('female')}
              activeOpacity={0.8}
            >
              <View style={styles.genderContent}>
                <FemaleIcon 
                  color={isFemaleSelected ? '#CDFC00' : '#666666'} 
                  size={48} 
                />
                <Text style={[
                  styles.genderLabel,
                  isFemaleSelected && styles.genderLabelSelected,
                ]}>
                  Female
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Get Started Button */}
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
              Get Started
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
    marginBottom: 16,
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
  description: {
    fontSize: 14,
    fontFamily: 'Averta',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 22,
    marginBottom: 32,
  },
  genderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  svgWrapper: {
    width: SCREEN_WIDTH - 48,
    height: 280,
    flexDirection: 'row',
    gap: 12,
  },
  malePanel: {
    flex: 1,
    backgroundColor: 'rgba(60, 60, 60, 0.5)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  femalePanel: {
    flex: 1,
    backgroundColor: 'rgba(60, 60, 60, 0.5)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelSelected: {
    borderColor: '#CDFC00',
    borderWidth: 2,
    backgroundColor: 'rgba(205, 252, 0, 0.05)',
  },
  genderContent: {
    alignItems: 'center',
    gap: 12,
  },
  genderLabel: {
    fontSize: 18,
    fontFamily: 'Averta-Bold',
    color: '#666666',
  },
  genderLabelSelected: {
    color: '#FFFFFF',
  },
  bottomSection: {
    marginTop: 'auto',
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

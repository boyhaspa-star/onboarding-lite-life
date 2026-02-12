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
import { colors, typography, spacing } from '@/constants/theme';
import { ProgressDots, ContinueButton } from '@/components';
import { onboarding$ } from '@/store/onboarding$';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Male icon component
const MaleIcon = ({ color = colors.text.primary, size = 48 }: { color?: string; size?: number }) => (
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
const FemaleIcon = ({ color = colors.text.primary, size = 48 }: { color?: string; size?: number }) => (
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
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);

  const handleSelect = (gender: 'male' | 'female') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedGender(gender);
  };

  const handleContinue = () => {
    if (selectedGender) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Persist to Legend-State store
      onboarding$.gender.set(selectedGender);
      router.push('/onboarding/age');
    }
  };

  const isMaleSelected = selectedGender === 'male';
  const isFemaleSelected = selectedGender === 'female';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Progress dots — shared component */}
        <ProgressDots total={4} active={1} />

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Good day</Text>
          <Text style={styles.titleAccent}>healthy body</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          With this app you can try different types of activities and choose the most enjoyable for you.
        </Text>

        {/* Gender Selection */}
        <View style={styles.genderContainer}>
          <View style={styles.svgWrapper}>
            {/* Left Panel - Male */}
            <TouchableOpacity
              style={[
                styles.panel,
                isMaleSelected && styles.panelSelected,
              ]}
              onPress={() => handleSelect('male')}
              activeOpacity={0.8}
            >
              <View style={styles.genderContent}>
                <MaleIcon 
                  color={isMaleSelected ? colors.brand.primary : colors.text.disabled} 
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
                styles.panel,
                isFemaleSelected && styles.panelSelected,
              ]}
              onPress={() => handleSelect('female')}
              activeOpacity={0.8}
            >
              <View style={styles.genderContent}>
                <FemaleIcon 
                  color={isFemaleSelected ? colors.brand.primary : colors.text.disabled} 
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

        {/* CTA Button — shared component */}
        <View style={styles.bottomSection}>
          <ContinueButton
            label="Get Started"
            onPress={handleContinue}
            disabled={!selectedGender}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen.paddingHorizontalLg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['6xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.primary,
  },
  titleAccent: {
    fontSize: typography.fontSize['6xl'],
    fontFamily: typography.fontFamily.heading,
    color: colors.brand.cta,
  },
  description: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.body,
    color: colors.overlay.white60,
    lineHeight: typography.lineHeight.loose,
    marginBottom: spacing['3xl'],
  },
  genderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  svgWrapper: {
    width: SCREEN_WIDTH - 48,
    height: 280,
    flexDirection: 'row',
    gap: spacing.md,
  },
  panel: {
    flex: 1,
    backgroundColor: colors.overlay.dark50,
    borderRadius: spacing.radius['2xl'],
    borderWidth: 1,
    borderColor: colors.overlay.white10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelSelected: {
    borderColor: colors.brand.primary,
    borderWidth: 2,
    backgroundColor: colors.overlay.accent5,
  },
  genderContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  genderLabel: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.disabled,
  },
  genderLabelSelected: {
    color: colors.text.primary,
  },
  bottomSection: {
    marginTop: 'auto',
  },
});

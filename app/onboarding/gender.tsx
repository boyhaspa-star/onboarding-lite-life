import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Circle, CheckCircle2 } from 'lucide-react-native';

type Gender = 'male' | 'female' | 'other' | null;

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender>(null);

  const handleContinue = () => {
    if (selectedGender) {
      router.push('/onboarding/birthday');
    }
  };

  const genderOptions = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'other', label: 'Not Define' },
  ];

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
              <View style={[styles.progressFill, { width: '25%' }]} />
            </View>
            <Text style={styles.pageIndicator}>1 of 4</Text>
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
            <Text style={styles.title}>Choose your gender</Text>

            <View style={styles.optionsContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    selectedGender === option.id && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedGender(option.id as Gender)}
                  activeOpacity={0.8}>
                  <View style={styles.radioContainer}>
                    {selectedGender === option.id ? (
                      <CheckCircle2 size={24} color="#22c55e" fill="#22c55e" />
                    ) : (
                      <Circle size={24} color="#555555" strokeWidth={2} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      selectedGender === option.id && styles.optionTextSelected,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.continueButton, !selectedGender && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!selectedGender}
            activeOpacity={0.85}>
            <Text style={styles.continueButtonText}>Continue</Text>
            <ArrowRight size={20} color={selectedGender ? '#000000' : '#666666'} />
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 32,
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
  heroSection: {
    marginBottom: 40,
    borderRadius: 24,
    overflow: 'hidden',
    height: 280,
  },
  heroImageWrapper: {
    flex: 1,
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
    height: '100%',
  },
  heroTextOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  heroMainText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#E6FE58',
    lineHeight: 52,
  },
  heroSecondaryText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
  },
  highlightText: {
    color: '#E6FE58',
  },
  formSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
    activeOpacity: 0.8,
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: '#22c55e',
  },
  radioContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#CCCCCC',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
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

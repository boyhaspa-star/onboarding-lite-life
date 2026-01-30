import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import WheelPicker from 'react-native-wheely';

// Generate ages from 13 to 80
const ages = Array.from({ length: 68 }, (_, i) => String(i + 13));
const DEFAULT_AGE_INDEX = ages.indexOf('24'); // Default to 24

export default function AgeScreen() {
  const [selectedIndex, setSelectedIndex] = useState(DEFAULT_AGE_INDEX);

  const handleContinue = () => {
    router.push('/onboarding/fitnessLevel');
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
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
            <Text style={styles.pageIndicator}>2 of 4</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.title}>What's your age?</Text>
            <Text style={styles.subtitle}>
              We'll use this to create your personalized workout plan
            </Text>

            <View style={styles.pickerContainer}>
              <View style={styles.pickerRow}>
                <WheelPicker
                  selectedIndex={selectedIndex}
                  options={ages}
                  onChange={(index) => setSelectedIndex(index)}
                  itemHeight={70}
                  containerStyle={styles.wheelContainer}
                  itemTextStyle={styles.wheelItemText}
                  selectedIndicatorStyle={styles.selectedIndicator}
                  visibleRest={2}
                  decelerationRate="fast"
                />
                <Text style={styles.yearsLabel}>years old</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}>
            <Text style={styles.continueButtonText}>Continue</Text>
            <ArrowRight size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#CDFC00',
    borderRadius: 2,
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  formSection: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    lineHeight: 24,
    marginBottom: 60,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelContainer: {
    width: 150,
  },
  wheelItemText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  selectedIndicator: {
    borderWidth: 2,
    borderColor: '#4a5a00',
    borderRadius: 12,
    backgroundColor: 'rgba(205, 252, 0, 0.08)',
  },
  yearsLabel: {
    fontSize: 20,
    color: '#666',
    marginLeft: 16,
  },
  continueButton: {
    backgroundColor: '#CDFC00',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});

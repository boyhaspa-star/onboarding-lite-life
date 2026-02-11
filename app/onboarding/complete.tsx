import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, ArrowRight, User, Sparkles } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Easing,
  useAnimatedReaction,
} from 'react-native-reanimated';
import AILoader from '@/components/AILoader';

const profileSetupMessages = [
  'Setting up your profile...',
  'Analyzing your preferences...',
  'Creating workout recommendations...',
  'Personalizing your experience...',
  'Almost ready...',
];

export default function CompleteScreen() {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleGetStarted = () => {
    setIsSettingUp(true);
  };

  const handleSetupComplete = () => {
    router.replace('/(tabs)');
  };

  if (isSettingUp) {
    return (
      <SafeAreaView style={styles.loaderContainer} edges={['top', 'bottom']}>
        <AILoader
          title="Setting Up Your Profile"
          messages={profileSetupMessages}
          accentColor="#CDFC00"
          icon={<Sparkles size={48} color="#CDFC00" />}
          onComplete={handleSetupComplete}
          duration={3500}
        />
      </SafeAreaView>
    );
  }

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
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.pageIndicator}>6 of 6</Text>
          </View>

          <View style={styles.celebrationSection}>
            <Animated.View
              style={[styles.checkmarkContainer, animatedStyle]}>
              <CheckCircle2 size={80} color="#22c55e" fill="#22c55e" />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(600)}>
              <Text style={styles.celebrationTitle}>You're all set!</Text>
              <Text style={styles.celebrationSubtitle}>
                Your personalized workout plan is ready
              </Text>
            </Animated.View>
          </View>

          <Animated.View
            style={styles.benefitsSection}
            entering={FadeInUp.delay(500).duration(600)}>
            <View style={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <Text style={styles.benefitIconText}>💪</Text>
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Personalized Workouts</Text>
                <Text style={styles.benefitDescription}>
                  Tailored to your fitness level
                </Text>
              </View>
            </View>

            <View style={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <Text style={styles.benefitIconText}>📊</Text>
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Track Progress</Text>
                <Text style={styles.benefitDescription}>
                  Monitor your improvements
                </Text>
              </View>
            </View>

            <View style={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <Text style={styles.benefitIconText}>🎯</Text>
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Achieve Goals</Text>
                <Text style={styles.benefitDescription}>
                  Reach your fitness targets
                </Text>
              </View>
            </View>
          </Animated.View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleGetStarted}
            activeOpacity={0.85}>
            <Text style={styles.startButtonText}>Let's Get Started</Text>
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
  loaderContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 40,
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
  celebrationSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  celebrationTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999999',
    textAlign: 'center',
  },
  benefitsSection: {
    marginBottom: 28,
    gap: 12,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitIconText: {
    fontSize: 24,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999999',
  },
  startButton: {
    backgroundColor: '#E6FE58',
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    shadowColor: '#E6FE58',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
});

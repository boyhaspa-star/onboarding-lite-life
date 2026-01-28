import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Play } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LandingScreen() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGetStarted = () => {
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.videoContainer}>
        <View style={styles.videoContainer}>
          <View style={styles.header}>
            <Image
              source={require('@/assets/svg/logo.svg')}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setIsPlaying(!isPlaying)}>
              <Play size={24} color="#307FF2" fill="#307FF2" />
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.textFrame}>
              <View style={styles.headlineFrame}>
                <View style={styles.firstLine}>
                  <Text style={styles.headlineText}>LET'S</Text>
                  <Text style={styles.headlineText}>GET</Text>
                  <Text style={styles.headlineText}>TO</Text>
                </View>
                <View style={styles.secondLine}>
                  <Text style={styles.headlineText}>NOW</Text>
                  <Text style={styles.headlineText}>YOU</Text>
                  <View style={styles.betterContainer}>
                    <Text style={styles.betterText}>BETTER</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.descriptionText}>
                Get your personalized workout and meal plan in just 1 minute to help you achieve
                your fitness goals
              </Text>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.signInButton}
                onPress={handleGetStarted}
                activeOpacity={0.8}>
                <Text style={styles.signInButtonText}>SIGN IN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signUpButton} activeOpacity={0.8}>
                <Text style={styles.signUpButtonText}>SIGN UP</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleGetStarted}
              activeOpacity={0.7}>
              <Text style={styles.skipButtonText}>Skip to Workout</Text>
            </TouchableOpacity>
          </View>
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
  videoContainer: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logo: {
    width: 40,
    height: 40,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(48, 127, 242, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  textFrame: {
    marginBottom: 24,
  },
  headlineFrame: {
    marginBottom: 16,
  },
  firstLine: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  secondLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headlineText: {
    fontSize: 64,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  betterContainer: {
    backgroundColor: '#E6FE58',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  betterText: {
    fontSize: 64,
    fontWeight: '800',
    color: '#000000',
  },
  descriptionText: {
    width: 327,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#D6D6D6',
  },
  buttonsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
    padding: 8,
    gap: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signInButton: {
    flex: 1,
    backgroundColor: '#E6FE58',
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#101010',
  },
  signUpButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  skipButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
  },
});

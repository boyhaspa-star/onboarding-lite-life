import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Play, ArrowUp, Dumbbell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LandingScreen() {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<Video>(null);

  const handleGetStarted = () => {
    router.push('/onboarding/gender');
  };

  const togglePlayback = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Background */}
      <Video
        ref={videoRef}
        source={require('@/assets/video/fitness.mp4')}
        style={styles.backgroundVideo}
        resizeMode={ResizeMode.COVER}
        shouldPlay={true}
        isLooping={true}
        isMuted={true}
      />

      {/* Dark Overlay Gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.95)']}
        locations={[0, 0.5, 0.85]}
        style={styles.overlay}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Dumbbell size={24} color="#E6FE58" strokeWidth={2.5} />
              <Text style={styles.logoText}>FITPOWER</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayback}
            activeOpacity={0.8}>
            <Play size={18} color="#307FF2" fill={isPlaying ? "#307FF2" : "transparent"} />
          </TouchableOpacity>
        </View>

        {/* Floating Badges */}
        <View style={styles.badgesContainer}>
          {/* 200 Cal Badge */}
          <View style={styles.calBadge}>
            <ArrowUp size={12} color="#E6FE58" />
            <Text style={styles.calText}>200 cal</Text>
          </View>

          {/* 15 Kilogram Badge */}
          <View style={styles.kgBadge}>
            <Text style={styles.kgText}>15 kilogram</Text>
          </View>

          {/* Decorative dotted lines */}
          <View style={styles.dottedLineHorizontal} />
          <View style={styles.dottedLineVertical} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.textFrame}>
            <View style={styles.headlineFrame}>
              <Text style={styles.headlineText}>LET'S GET TO</Text>
              <View style={styles.secondLine}>
                <Text style={styles.headlineText}>NOW YOU </Text>
                <View style={styles.betterContainer}>
                  <Text style={styles.betterText}>BETTER</Text>
                </View>
              </View>
            </View>

            <Text style={styles.descriptionText}>
              Get your personalized workout and meal plan in just 1 minute to help you achieve your fitness goals
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleGetStarted}
              activeOpacity={0.8}>
              <Text style={styles.signInButtonText}>SIGN IN</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.signUpButton} 
              onPress={handleGetStarted}
              activeOpacity={0.8}>
              <Text style={styles.signUpButtonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#307FF2',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgesContainer: {
    flex: 1,
    position: 'relative',
  },
  calBadge: {
    position: 'absolute',
    top: '35%',
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  calText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  kgBadge: {
    position: 'absolute',
    top: '45%',
    right: 20,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  kgText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  dottedLineHorizontal: {
    position: 'absolute',
    top: '42%',
    left: 90,
    width: 100,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dottedLineVertical: {
    position: 'absolute',
    top: '42%',
    right: 80,
    width: 1,
    height: 30,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  contentContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  textFrame: {
    marginBottom: 32,
  },
  headlineFrame: {
    marginBottom: 16,
  },
  secondLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  headlineText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  betterContainer: {
    backgroundColor: '#E6FE58',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  betterText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },
  buttonsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 100,
    padding: 6,
    flexDirection: 'row',
    gap: 8,
  },
  signInButton: {
    flex: 1,
    backgroundColor: '#E6FE58',
    borderRadius: 100,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
  },
  signUpButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 100,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

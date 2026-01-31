import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Configuration
const ITEM_HEIGHT = 80;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const MIN_AGE = 13;
const MAX_AGE = 80;
const DEFAULT_AGE = 24;

// Generate ages array
const ages = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i);

export default function AgeScreen() {
  const [selectedAge, setSelectedAge] = useState(DEFAULT_AGE);
  const scrollY = useRef(new Animated.Value(-(DEFAULT_AGE - MIN_AGE) * ITEM_HEIGHT)).current;
  const lastOffset = useRef(-(DEFAULT_AGE - MIN_AGE) * ITEM_HEIGHT);
  const lastHapticIndex = useRef(DEFAULT_AGE - MIN_AGE);
  const velocity = useRef(0);
  const decayAnimation = useRef<Animated.CompositeAnimation | null>(null);

  // Trigger haptic when crossing item boundaries
  const triggerHapticIfNeeded = useCallback((offset: number) => {
    const currentIndex = Math.round(-offset / ITEM_HEIGHT);
    if (currentIndex !== lastHapticIndex.current && currentIndex >= 0 && currentIndex < ages.length) {
      // Use selectionAsync for the authentic iOS picker feel
      Haptics.selectionAsync();
      lastHapticIndex.current = currentIndex;
    }
  }, []);

  // Listen to scroll changes for haptic feedback
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      triggerHapticIfNeeded(value);
    });
    return () => scrollY.removeListener(listenerId);
  }, [scrollY, triggerHapticIfNeeded]);

  const snapToIndex = useCallback((targetIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(ages.length - 1, targetIndex));
    const targetOffset = -clampedIndex * ITEM_HEIGHT;
    
    Animated.spring(scrollY, {
      toValue: targetOffset,
      damping: 20,
      stiffness: 150,
      mass: 0.8,
      useNativeDriver: true,
    }).start(() => {
      lastOffset.current = targetOffset;
      setSelectedAge(ages[clampedIndex]);
    });
  }, [scrollY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Stop any ongoing animation
        if (decayAnimation.current) {
          decayAnimation.current.stop();
        }
        scrollY.stopAnimation();
        scrollY.setOffset(lastOffset.current);
        scrollY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        velocity.current = gestureState.vy;
        scrollY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        scrollY.flattenOffset();
        
        const currentOffset = lastOffset.current + gestureState.dy;
        const currentVelocity = gestureState.vy;
        
        // Calculate target based on velocity
        const projectedOffset = currentOffset + currentVelocity * 150;
        const targetIndex = Math.round(-projectedOffset / ITEM_HEIGHT);
        
        lastOffset.current = currentOffset;
        snapToIndex(targetIndex);
      },
    })
  ).current;

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/fitnessLevel');
  };

  const renderItem = (age: number, index: number) => {
    const inputRange = [
      -(index + 2) * ITEM_HEIGHT,
      -(index + 1) * ITEM_HEIGHT,
      -index * ITEM_HEIGHT,
      -(index - 1) * ITEM_HEIGHT,
      -(index - 2) * ITEM_HEIGHT,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.5, 0.7, 1, 0.7, 0.5],
      extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.2, 0.4, 1, 0.4, 0.2],
      extrapolate: 'clamp',
    });

    const rotateX = scrollY.interpolate({
      inputRange,
      outputRange: ['60deg', '30deg', '0deg', '-30deg', '-60deg'],
      extrapolate: 'clamp',
    });

    const translateY = scrollY.interpolate({
      inputRange,
      outputRange: [-15, -5, 0, 5, 15],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={age}
        style={[
          styles.item,
          {
            opacity,
            transform: [
              { perspective: 1000 },
              { scale },
              { rotateX },
              { translateY },
            ],
          },
        ]}
      >
        <Text style={styles.itemText}>{age}</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#0a0a0a', '#000000']}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
            <Text style={styles.pageIndicator}>2 of 4</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>What's your age?</Text>
          <Text style={styles.subtitle}>
            We'll use this to create your personalized workout plan
          </Text>

          {/* Picker */}
          <View style={styles.pickerWrapper}>
            <View style={styles.pickerContainer}>
              {/* Selection Highlight */}
              <View style={styles.selectionHighlight} />
              
              {/* Years label */}
              <View style={styles.yearsLabelContainer}>
                <Text style={styles.yearsLabel}>years old</Text>
              </View>

              {/* Wheel */}
              <View style={styles.wheelContainer} {...panResponder.panHandlers}>
                <Animated.View
                  style={[
                    styles.wheel,
                    {
                      transform: [{ translateY: scrollY }],
                    },
                  ]}
                >
                  {/* Top padding */}
                  <View style={{ height: ITEM_HEIGHT * 2 }} />
                  {ages.map((age, index) => renderItem(age, index))}
                  {/* Bottom padding */}
                  <View style={{ height: ITEM_HEIGHT * 2 }} />
                </Animated.View>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
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
    backgroundColor: '#222',
    borderRadius: 2,
    marginBottom: 12,
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
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#888',
    lineHeight: 24,
    marginBottom: 40,
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: SCREEN_WIDTH - 48,
    height: PICKER_HEIGHT,
    position: 'relative',
  },
  selectionHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderWidth: 2.5,
    borderColor: '#CDFC00',
    borderRadius: 16,
    backgroundColor: 'rgba(205, 252, 0, 0.08)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  yearsLabelContainer: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    right: 40,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    zIndex: 2,
    pointerEvents: 'none',
  },
  yearsLabel: {
    fontSize: 22,
    color: '#666',
    fontWeight: '500',
  },
  wheelContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  wheel: {
    width: '100%',
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingLeft: 40,
  },
  itemText: {
    fontSize: 56,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -2,
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

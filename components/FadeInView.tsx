import React, { useEffect, useRef } from 'react';
import { StyleProp, ViewStyle, Animated } from 'react-native';

type Direction = 'up' | 'down' | 'fade';

interface FadeInViewProps {
  /** Index in a list — used to calculate stagger delay */
  index?: number;
  /** Delay between items in ms (default 80) */
  stagger?: number;
  /** Extra base delay before the first item (default 0) */
  delay?: number;
  /** Duration in ms (default 400) */
  duration?: number;
  /** Direction to animate from (default 'down') */
  direction?: Direction;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/**
 * Wrap any element to give it an entrance animation.
 * For lists, pass `index` to get automatic stagger:
 *
 *   {items.map((item, i) => (
 *     <FadeInView key={item.id} index={i}>
 *       <Card {...item} />
 *     </FadeInView>
 *   ))}
 */
export function FadeInView({
  index = 0,
  stagger = 80,
  delay = 0,
  duration = 400,
  direction = 'down',
  style,
  children,
}: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(direction === 'up' ? -20 : direction === 'down' ? 20 : 0)).current;

  useEffect(() => {
    const totalDelay = delay + index * stagger;

    const animations = [
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay: totalDelay,
        useNativeDriver: true,
      }),
    ];

    if (direction !== 'fade') {
      animations.push(
        Animated.timing(translate, {
          toValue: 0,
          duration,
          delay: totalDelay,
          useNativeDriver: true,
        }),
      );
    }

    Animated.parallel(animations).start();
  }, []);

  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> =
    direction === 'fade'
      ? { opacity }
      : { opacity, transform: [{ translateY: translate }] };

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

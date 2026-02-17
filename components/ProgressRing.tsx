import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { colors } from '@/constants/theme';

interface ProgressRingProps {
  /** 0–100 */
  percentage: number;
  /** Outer diameter in px */
  size?: number;
  /** Ring thickness */
  strokeWidth?: number;
  /** Track (background) color */
  trackColor?: string;
  /** Active arc color */
  activeColor?: string;
  /** Label color */
  labelColor?: string;
  /** Show percentage text */
  showLabel?: boolean;
}

export function ProgressRing({
  percentage,
  size = 70,
  strokeWidth = 5,
  trackColor = colors.brand.primaryDark,
  activeColor = colors.brand.primary,
  labelColor = colors.text.primary,
  showLabel = true,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dashLength = circumference * (percentage / 100);

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Active arc */}
        {percentage > 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
        {/* Label */}
        {showLabel && (
          <SvgText
            x={size / 2}
            y={size / 2 + 5}
            textAnchor="middle"
            fontSize={size * 0.23}
            fontWeight="600"
            fill={labelColor}>
            {percentage}%
          </SvgText>
        )}
      </Svg>
    </View>
  );
}

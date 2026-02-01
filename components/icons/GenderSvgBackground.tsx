import React from 'react';
import Svg, { Path, Mask, Defs } from 'react-native-svg';

interface GenderSvgProps {
  width?: number;
  height?: number;
  leftColor?: string;
  rightColor?: string;
  leftBorderColor?: string;
  rightBorderColor?: string;
}

export default function GenderSvgBackground({
  width = 327,
  height = 368,
  leftColor = 'rgba(0,0,0,0.2)',
  rightColor = 'rgba(0,0,0,0.2)',
  leftBorderColor = 'rgba(255,255,255,0.3)',
  rightBorderColor = 'rgba(255,255,255,0.3)',
}: GenderSvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 327 368" fill="none">
      {/* Left panel (male) */}
      <Path
        d="M0 16C0 7.16344 7.16344 0 16 0H147.5C156.337 0 163.5 7.16344 163.5 16V24.8889C163.5 33.7255 156.337 40.8889 147.5 40.8889H16C7.16344 40.8889 0 33.7255 0 24.8889V16Z"
        fill={leftColor}
      />
      <Path
        d="M0 56.8889C0 48.0524 7.16344 40.8889 16 40.8889H147.5C156.337 40.8889 163.5 48.0524 163.5 56.8889V311.111C163.5 319.947 156.337 327.111 147.5 327.111H16C7.16344 327.111 0 319.947 0 311.111V56.8889Z"
        fill={leftColor}
        stroke={leftBorderColor}
        strokeWidth="2"
      />
      
      {/* Right panel (female) */}
      <Path
        d="M163.5 343.111C163.5 334.274 170.663 327.111 179.5 327.111H311C319.837 327.111 327 334.274 327 343.111V352C327 360.836 319.837 368 311 368H179.5C170.663 368 163.5 360.836 163.5 352V343.111Z"
        fill={rightColor}
      />
      <Path
        d="M163.5 56.8889C163.5 48.0524 170.663 40.8889 179.5 40.8889H311C319.837 40.8889 327 48.0524 327 56.8889V311.111C327 319.947 319.837 327.111 311 327.111H179.5C170.663 327.111 163.5 319.947 163.5 311.111V56.8889Z"
        fill={rightColor}
        stroke={rightBorderColor}
        strokeWidth="2"
      />
    </Svg>
  );
}

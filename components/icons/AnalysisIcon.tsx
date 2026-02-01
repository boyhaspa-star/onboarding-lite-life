import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface AnalysisIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function AnalysisIcon({ width = 21, height = 22, color = '#6D6D6D' }: AnalysisIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 21 22" fill="none">
      <Path
        d="M5.35143 8.70172V15.5619"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.0181 5.41913V15.5618"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.6086 12.3268V15.5619"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.6657 0.5H5.29428C2.02761 0.5 -0.0200043 2.81208 -0.0200043 6.08516V14.9148C-0.0200043 18.1879 2.01809 20.5 5.29428 20.5H14.6657C17.9419 20.5 19.98 18.1879 19.98 14.9148V6.08516C19.98 2.81208 17.9419 0.5 14.6657 0.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

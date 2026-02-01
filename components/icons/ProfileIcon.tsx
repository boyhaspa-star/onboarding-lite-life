import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ProfileIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function ProfileIcon({ width = 28, height = 28, color = '#6D6D6D' }: ProfileIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.9822 17.9039C9.47 17.9039 5.61667 18.5861 5.61667 21.3183C5.61667 24.0505 9.44556 24.7572 13.9822 24.7572C18.4944 24.7572 22.3467 24.0739 22.3467 21.3428C22.3467 18.6116 18.5189 17.9039 13.9822 17.9039Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.9822 14.0068C16.9434 14.0068 19.3434 11.6057 19.3434 8.64462C19.3434 5.68351 16.9434 3.28351 13.9822 3.28351C11.0211 3.28351 8.62003 5.68351 8.62003 8.64462C8.61003 11.5957 10.9945 13.9968 13.9445 14.0068H13.9822Z"
        stroke={color}
        strokeWidth="1.42857"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

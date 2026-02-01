import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface HouseIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function HouseIcon({ width = 24, height = 24, color = '#CDFC00' }: HouseIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13.0174 0.400781C12.4409 -0.133594 11.5502 -0.133594 10.9784 0.400781L0.478372 10.1508C0.028372 10.5727 -0.121628 11.2242 0.103372 11.7961C0.328372 12.368 0.87681 12.7477 1.49556 12.7477H2.24556V20.9977C2.24556 22.6523 3.59087 23.9977 5.24556 23.9977H18.7456C20.4002 23.9977 21.7456 22.6523 21.7456 20.9977V12.7477H22.4956C23.1143 12.7477 23.6674 12.368 23.8924 11.7961C24.1174 11.2242 23.9674 10.568 23.5174 10.1508L13.0174 0.400781ZM11.2456 14.9977H12.7456C13.9877 14.9977 14.9956 16.0055 14.9956 17.2477V21.7477H8.99556V17.2477C8.99556 16.0055 10.0034 14.9977 11.2456 14.9977Z"
        fill={color}
      />
    </Svg>
  );
}

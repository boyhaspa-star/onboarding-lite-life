/**
 * BodyView — Custom SVG body highlighter.
 *
 * Highlighted muscles get a solid color fill.
 * Non-highlighted body parts render with their default dim color.
 *
 * Same prop interface as react-native-body-highlighter's BodyView.
 */

import React, { memo } from 'react';
import { Path } from 'react-native-svg';

// @ts-ignore — accessing internal package assets (Metro resolves fine)
import { bodyFront } from 'react-native-body-highlighter/assets/bodyFront';
// @ts-ignore
import { bodyBack } from 'react-native-body-highlighter/assets/bodyBack';
// @ts-ignore
import { bodyFemaleFront } from 'react-native-body-highlighter/assets/bodyFemaleFront';
// @ts-ignore
import { bodyFemaleBack } from 'react-native-body-highlighter/assets/bodyFemaleBack';
// @ts-ignore
import { SvgMaleWrapper } from 'react-native-body-highlighter/components/SvgMaleWrapper';
// @ts-ignore
import { SvgFemaleWrapper } from 'react-native-body-highlighter/components/SvgFemaleWrapper';

// ─── Types ────────────────────────────────────────────────

interface BodyPartData {
  slug?: string;
  intensity?: number;
  side?: 'left' | 'right';
  color?: string;
  path?: { common?: string[]; left?: string[]; right?: string[] };
}

export interface AnimatedBodyProps {
  data: ReadonlyArray<BodyPartData>;
  gender?: 'male' | 'female';
  side?: 'front' | 'back';
  scale?: number;
  colors?: ReadonlyArray<string>;
  onBodyPartPress?: (bodyPart: BodyPartData, side?: 'left' | 'right') => void;
  border?: string | 'none';
}

/** Default fill for body parts not highlighted */
const DEFAULT_DIM = '#3f3f3f';

// ─── Helper: render all paths for one body part ───────────

function renderPaths(
  pathList: string[],
  fill: string,
  onPress?: () => void,
) {
  return pathList.map((d) => (
    <Path key={d} d={d} fill={fill} onPress={onPress} />
  ));
}

// ─── AnimatedBodyView (static — no animation) ────────────

const AnimatedBodyView = memo(function AnimatedBodyView({
  data,
  gender = 'male',
  side = 'front',
  scale = 1,
  colors = ['#0984e3', '#74b9ff'],
  onBodyPartPress,
  border = '#dfdfdf',
}: AnimatedBodyProps) {
  const isFemale = gender === 'female';
  const dataSource: BodyPartData[] = isFemale
    ? side === 'front'
      ? bodyFemaleFront
      : bodyFemaleBack
    : side === 'front'
      ? bodyFront
      : bodyBack;
  const SvgWrapper = isFemale ? SvgFemaleWrapper : SvgMaleWrapper;

  // Build slug → userData map for O(1) lookups
  const dataMap = new Map<string, BodyPartData>();
  data.forEach((d) => {
    if (d.slug) dataMap.set(d.slug, d);
  });

  return (
    <SvgWrapper side={side} scale={scale} border={border}>
      {dataSource.map((part) => {
        const slug = part.slug!;
        const userData = dataMap.get(slug);

        if (userData) {
          const intensity = userData.intensity || 1;
          const highlightColor = (colors[intensity - 1] || colors[0]) as string;

          return (
            <React.Fragment key={slug}>
              {/* Common paths — always highlighted */}
              {renderPaths(
                part.path?.common || [],
                highlightColor,
                onBodyPartPress ? () => onBodyPartPress(userData) : undefined,
              )}
              {/* Left paths */}
              {renderPaths(
                part.path?.left || [],
                userData.side === 'right' ? DEFAULT_DIM : highlightColor,
                onBodyPartPress ? () => onBodyPartPress(userData, 'left') : undefined,
              )}
              {/* Right paths */}
              {renderPaths(
                part.path?.right || [],
                userData.side === 'left' ? DEFAULT_DIM : highlightColor,
                onBodyPartPress ? () => onBodyPartPress(userData, 'right') : undefined,
              )}
            </React.Fragment>
          );
        }

        // Non-highlighted body part
        return (
          <React.Fragment key={slug}>
            {renderPaths(
              part.path?.common || [],
              part.color || DEFAULT_DIM,
              onBodyPartPress ? () => onBodyPartPress(part) : undefined,
            )}
            {renderPaths(
              part.path?.left || [],
              part.color || DEFAULT_DIM,
              onBodyPartPress ? () => onBodyPartPress(part, 'left') : undefined,
            )}
            {renderPaths(
              part.path?.right || [],
              part.color || DEFAULT_DIM,
              onBodyPartPress ? () => onBodyPartPress(part, 'right') : undefined,
            )}
          </React.Fragment>
        );
      })}
    </SvgWrapper>
  );
});

export default AnimatedBodyView;

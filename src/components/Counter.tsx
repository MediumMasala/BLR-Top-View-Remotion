import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../data/theme';
import {COUNT_END, COUNT_START, counterEasing} from '../lib/dropFrames';
import {Reel} from './Reel';

const SUB_SIZE = 38;
const SUB_FONT = '"Arial Narrow", "Arial", sans-serif';

// Subline under the title: "[rolling 500]+ Engineering Managers live from
// Bangalore". The odometer + punch moved down here from the title bar.
export const Counter: React.FC<{
  targetCount: number;
  role: string;
  city: string;
  scale: number;
}> = ({targetCount, role, city, scale}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const value =
    interpolate(frame, [COUNT_START, COUNT_END], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: counterEasing,
    }) * targetCount;
  const atTarget = frame >= COUNT_END;

  const enterOpacity = interpolate(frame, [4, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const rise = interpolate(frame, [4, 16], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const drift = Math.sin(frame / 41 + 2) * 1.4 * scale;

  // the 500 punch, on the number only
  const punch = interpolate(
    frame,
    [COUNT_END, COUNT_END + 6, COUNT_END + 16],
    [1, 1.18, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease)}
  );
  const plusPop = spring({
    frame: frame - COUNT_END,
    fps,
    config: {damping: 10, mass: 0.6, stiffness: 200},
  });

  const size = SUB_SIZE * scale;
  const reels = String(targetCount).length;

  return (
    <div
      style={{
        position: 'absolute',
        top: 226 * scale,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: enterOpacity,
        transform: `translateY(${rise * scale + drift}px)`,
        fontFamily: SUB_FONT,
        fontWeight: 700,
        fontSize: size,
        color: colors.white,
        textShadow: '0 2px 12px rgba(0,0,0,0.5)',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum"',
          transform: `scale(${punch})`,
          transformOrigin: '50% 55%',
        }}
      >
        {Array.from({length: reels}, (_, i) => (
          <Reel key={i} place={reels - 1 - i} value={value} size={size} />
        ))}
        <span
          style={{
            width: '0.62ch',
            textAlign: 'left',
            lineHeight: `${size}px`,
            opacity: atTarget ? 1 : 0,
            transform: atTarget
              ? `scale(${0.4 + 0.6 * plusPop})`
              : 'scale(0.4)',
            transformOrigin: '30% 60%',
          }}
        >
          +
        </span>
      </span>
      <span style={{marginLeft: '0.85ch', whiteSpace: 'nowrap'}}>
        {role} live from {city}
      </span>
    </div>
  );
};

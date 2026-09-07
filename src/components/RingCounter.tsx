import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../data/theme';
import {COUNT_END, COUNT_START, counterEasing} from '../lib/dropFrames';
import {Reel} from './Reel';

const NUM_SIZE = 150;
const R = 190; // ring radius
const STROKE = 22;

// Circular gauge: a red arc sweeps around as the count climbs, a green
// live-dot rides the arc tip, the odometer in the middle rolls to 500+.
export const RingCounter: React.FC<{targetCount: number; scale: number}> = ({
  targetCount,
  scale,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = interpolate(frame, [COUNT_START, COUNT_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: counterEasing,
  });
  const value = progress * targetCount;
  const atTarget = frame >= COUNT_END;

  // gauge entrance
  const enter = spring({
    frame: frame - 4,
    fps,
    config: {damping: 14, mass: 0.8, stiffness: 140},
  });

  // punch when it locks on target
  const punch = interpolate(
    frame,
    [COUNT_END, COUNT_END + 6, COUNT_END + 16],
    [1, 1.06, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease)}
  );
  const plusPop = spring({
    frame: frame - COUNT_END,
    fps,
    config: {damping: 10, mass: 0.6, stiffness: 200},
  });

  // breathing + blink during the hold so nothing sits still
  const breathe = 1 + Math.sin(frame / 34) * 0.004;
  const dotBlink = atTarget
    ? 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(frame / 9))
    : 1;

  const size = (R + STROKE) * 2;
  const C = 2 * Math.PI * R;
  const angle = -Math.PI / 2 + progress * 2 * Math.PI;
  const tipX = size / 2 + R * Math.cos(angle);
  const tipY = size / 2 + R * Math.sin(angle);

  const numSize = NUM_SIZE * scale;
  const reels = String(targetCount).length;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 700 * scale,
        transform: `translate(-50%, -50%) scale(${
          (0.7 + 0.3 * enter) * punch * breathe
        })`,
        opacity: Math.min(1, enter * 1.4),
        width: size * scale,
        height: size * scale,
      }}
    >
      <svg
        width={size * scale}
        height={size * scale}
        viewBox={`0 0 ${size} ${size}`}
        style={{position: 'absolute', inset: 0}}
      >
        {/* dark glass behind the gauge so it reads over the city */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R - STROKE / 2 - 4}
          fill="rgba(6,10,20,0.38)"
        />
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={STROKE}
        />
        {/* progress arc, sweeping from 12 o'clock */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke={colors.pinRed}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))'}}
        />
        {/* live dot riding the arc tip */}
        <circle
          cx={tipX}
          cy={tipY}
          r={STROKE / 2 + 7}
          fill={colors.liveGreen}
          stroke={colors.white}
          strokeWidth={4}
          opacity={dotBlink}
        />
      </svg>
      {/* odometer in the centre */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Obviously Narrow", "Arial Narrow", sans-serif',
          fontWeight: 600,
          fontSize: numSize,
          color: colors.white,
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum"',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        {Array.from({length: reels}, (_, i) => (
          <Reel key={i} place={reels - 1 - i} value={value} size={numSize} />
        ))}
        <div
          style={{
            width: '0.62ch',
            textAlign: 'left',
            lineHeight: `${numSize}px`,
            opacity: atTarget ? 1 : 0,
            transform: atTarget
              ? `scale(${0.4 + 0.6 * plusPop})`
              : 'scale(0.4)',
            transformOrigin: '30% 60%',
          }}
        >
          +
        </div>
      </div>
    </div>
  );
};

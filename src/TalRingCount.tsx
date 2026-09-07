import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Background} from './components/Background';
import {Headline} from './components/Headline';
import {Counter} from './components/Counter';
import {RingCounter} from './components/RingCounter';
import {Lockup} from './components/Lockup';
import {DESIGN} from './data/theme';
import {COUNT_END} from './lib/dropFrames';
import type {TalPinDropProps} from './TalPinDrop';

// Ring variant: same title / subline / badges / wordmark, but the pins are
// replaced by one big rotating gauge that fills to the target count.
export const TalRingCount: React.FC<TalPinDropProps> = ({
  city,
  targetCount,
  role,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const stageSize = Math.max(width, height);
  const overlayScale = Math.min(width, height) / DESIGN;

  const shaking = frame >= COUNT_END && frame < COUNT_END + 5;
  const shakeX = shaking ? (random(`sx-${frame}`) - 0.5) * 2 * 3 : 0;
  const shakeY = shaking ? (random(`sy-${frame}`) - 0.5) * 2 * 3 : 0;

  const flash = interpolate(
    frame,
    [COUNT_END, COUNT_END + 1, COUNT_END + 4],
    [0, 0.12, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#0a0e18', fontFamily: 'Poppins'}}>
      <AbsoluteFill style={{transform: `translate(${shakeX}px, ${shakeY}px)`}}>
        <div
          style={{
            position: 'absolute',
            width: stageSize,
            height: stageSize,
            left: (width - stageSize) / 2,
            top: (height - stageSize) / 2,
          }}
        >
          <Background city={city} />
        </div>
        <Headline scale={overlayScale} />
        <Counter
          targetCount={targetCount}
          role={role}
          city={city}
          scale={overlayScale}
        />
        <RingCounter targetCount={targetCount} scale={overlayScale} />
        <Lockup scale={overlayScale} />
      </AbsoluteFill>
      {flash > 0 ? (
        <AbsoluteFill style={{backgroundColor: '#fff', opacity: flash}} />
      ) : null}
    </AbsoluteFill>
  );
};

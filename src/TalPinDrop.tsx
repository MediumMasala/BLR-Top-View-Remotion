import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Poppins';
import {loadFont as loadArchivoBlack} from '@remotion/google-fonts/ArchivoBlack';
import {loadFont as loadLocalFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {z} from 'zod';
import {Background} from './components/Background';
import {Headline} from './components/Headline';
import {Counter} from './components/Counter';
import {PinField} from './components/PinField';
import {Lockup} from './components/Lockup';
import {DESIGN} from './data/theme';
import {COUNT_END} from './lib/dropFrames';

loadFont('normal', {weights: ['500', '800'], subsets: ['latin']});
loadArchivoBlack('normal', {weights: ['400'], subsets: ['latin']});
loadLocalFont({
  family: 'Arial Narrow',
  url: staticFile('fonts/arial-narrow-bold.ttf'),
  weight: '700',
});
loadLocalFont({
  family: 'Obviously Narrow',
  url: staticFile('fonts/obviously-narrow-semibold.otf'),
  weight: '600',
});

export const talSchema = z.object({
  city: z.string(),
  targetCount: z.number().int().min(1),
  role: z.string(),
});

export type TalPinDropProps = z.infer<typeof talSchema>;

// One component, all formats. The skyline + pins live on a square "stage"
// sized to cover the frame; text overlays are laid out in frame space and
// scale off the short edge.
export const TalPinDrop: React.FC<TalPinDropProps> = ({
  city,
  targetCount,
  role,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const stageSize = Math.max(width, height);
  const overlayScale = Math.min(width, height) / DESIGN;

  // 3px camera shake for 5 frames at the 500 punch (seeded, render-safe)
  const shaking = frame >= COUNT_END && frame < COUNT_END + 5;
  const shakeX = shaking ? (random(`sx-${frame}`) - 0.5) * 2 * 3 : 0;
  const shakeY = shaking ? (random(`sy-${frame}`) - 0.5) * 2 * 3 : 0;

  // 4-frame white flash at 12% opacity
  const flash = interpolate(
    frame,
    [COUNT_END, COUNT_END + 1, COUNT_END + 4],
    [0, 0.12, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#0a0e18', fontFamily: 'Poppins'}}>
      <AbsoluteFill
        style={{transform: `translate(${shakeX}px, ${shakeY}px)`}}
      >
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
          <PinField targetCount={targetCount} stageSize={stageSize} />
        </div>
        <Headline scale={overlayScale} />
        <Counter
          targetCount={targetCount}
          role={role}
          city={city}
          scale={overlayScale}
        />
        <Lockup scale={overlayScale} />
      </AbsoluteFill>
      {flash > 0 ? (
        <AbsoluteFill style={{backgroundColor: '#fff', opacity: flash}} />
      ) : null}
    </AbsoluteFill>
  );
};

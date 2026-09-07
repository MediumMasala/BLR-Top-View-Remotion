import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {colors} from '../data/theme';

// Static plate — no Ken Burns; the pins + text carry all the motion.
export const Background: React.FC<{city: string}> = ({city}) => {
  const src = staticFile(`bg/skyline-${city.toLowerCase()}.png`);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={src}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
      {/* warm vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 120% 120% at 50% 42%, rgba(0,0,0,0) 55%, rgba(30,12,4,0.34) 100%)',
        }}
      />
      {/* top scrim behind headline */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, ${colors.scrim} 0%, rgba(6,10,20,0.28) 26%, rgba(6,10,20,0) 44%)`,
        }}
      />
    </AbsoluteFill>
  );
};

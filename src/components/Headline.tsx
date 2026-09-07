import React from 'react';
import {useCurrentFrame} from 'remotion';
import {colors} from '../data/theme';

const TITLE = 'FASTEST HIRING APP';
const TITLE_SIZE = 96;
// Obviously Narrow Semibold, all caps (bundled OTF, loaded in TalPinDrop.tsx)
const DISPLAY_FONT = '"Obviously Narrow", "Arial Narrow", sans-serif';

// Title: no entrance animation — solid from frame 0.
// Only the ambient drift keeps it alive.
export const Headline: React.FC<{scale: number}> = ({scale}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 46) * 1.6 * scale;

  return (
    <div
      style={{
        position: 'absolute',
        top: 110 * scale,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        transform: `translateY(${drift}px)`,
      }}
    >
      <div
        style={{
          fontFamily: DISPLAY_FONT,
          fontWeight: 600,
          fontSize: TITLE_SIZE * scale,
          lineHeight: 1.05,
          letterSpacing: '0.015em',
          color: colors.white,
          textShadow: '0 4px 24px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        {TITLE}
      </div>
    </div>
  );
};

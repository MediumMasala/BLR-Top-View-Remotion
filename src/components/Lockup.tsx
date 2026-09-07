import React from 'react';
import {
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const IN = 150;

// tal wordmark (tinted cream via CSS mask) + BY GRAPEVINE, bottom-left.
// Store badges fade in below the counter with a 3-frame stagger.
export const Lockup: React.FC<{scale: number}> = ({scale}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  // In wide formats the vertical stage crop pushes the horizon pins up into
  // the under-counter slot, so the badges move to the bottom-right corner.
  const wide = width / height > 1.2;

  const t = interpolate(frame, [IN, IN + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const drift = Math.sin(frame / 39 + 5) * 1.3 * scale;

  const badgeOpacity = (delay: number) =>
    interpolate(frame, [IN + 4 + delay, IN + 20 + delay], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

  const badgeH = 44 * scale;

  return (
    <>
      {/* talBOSS wordmark, bottom-left — solid from frame 0, no fade */}
      <div
        style={{
          position: 'absolute',
          left: 64 * scale,
          bottom: 64 * scale - drift,
        }}
      >
        <Img
          src={staticFile('brand/talboss-wordmark.png')}
          style={{
            width: 300 * scale,
            filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.55))',
          }}
        />
      </div>
      {/* store badges below the counter (bottom-right in wide formats) */}
      <div
        style={{
          position: 'absolute',
          ...(wide
            ? {right: 64 * scale, bottom: 60 * scale - drift}
            : {top: 284 * scale + drift, left: 0, right: 0}),
          display: 'flex',
          justifyContent: 'center',
          gap: 16 * scale,
        }}
      >
        <Img
          src={staticFile('brand/badge-appstore.png')}
          style={{height: badgeH, opacity: badgeOpacity(0)}}
        />
        <Img
          src={staticFile('brand/badge-googleplay.png')}
          style={{height: badgeH, opacity: badgeOpacity(3)}}
        />
      </div>
    </>
  );
};

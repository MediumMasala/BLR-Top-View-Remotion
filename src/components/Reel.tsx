import React from 'react';
import {interpolate} from 'remotion';

// One odometer reel. `value` is the continuous (unrounded) counter value.
// Mechanical odometer behaviour: the units reel rolls continuously; a higher
// reel only rolls while the reels below it pass their 9->0 rollover.
export const Reel: React.FC<{place: number; value: number; size: number}> = ({
  place,
  value,
  size,
}) => {
  const col =
    place === 0
      ? value % 10
      : (Math.floor(value / 10 ** place) % 10) +
        Math.max(0, (value % 10 ** place) - (10 ** place - 1));
  // leading reels stay blank until the value reaches their magnitude
  const reveal =
    place === 0
      ? 1
      : interpolate(value, [10 ** place - 2, 10 ** place], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  return (
    <div
      style={{
        width: '1ch',
        height: size,
        overflow: 'hidden',
        position: 'relative',
        opacity: reveal,
      }}
    >
      <div style={{transform: `translateY(${-col * size}px)`}}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
          <div
            key={i}
            style={{
              height: size,
              lineHeight: `${size}px`,
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

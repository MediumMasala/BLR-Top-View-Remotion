import {Easing, interpolate} from 'remotion';

export const COUNT_START = 12; // everything moving well before 0.5s
export const COUNT_END = 130;

export const counterEasing = Easing.bezier(0.3, 0.55, 0.2, 1);

// Single source of truth for the counter value — Counter.tsx and the pin
// sync both read this so criterion "pins on screen === floor(count/perPin)"
// holds by construction.
export const countAtFrame = (frame: number, targetCount: number): number => {
  const progress = interpolate(frame, [COUNT_START, COUNT_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: counterEasing,
  });
  return Math.round(progress * targetCount);
};

// Epsilon guards float noise: 500 / (500/24) must floor to 24, not 23.
export const visibleAtCount = (count: number, perPin: number): number =>
  Math.floor(count / perPin + 1e-9);

const cache = new Map<string, number[]>();

// dropStartFrames[i] = first integer frame at which pin i has started
// dropping, i.e. the first frame where floor(count / perPin) > i.
// Inverts the counter easing by a single forward scan, memoised per
// (targetCount, pinCount) so it runs once, not per frame.
export const getDropStartFrames = (
  targetCount: number,
  pinCount: number
): number[] => {
  const key = `${targetCount}:${pinCount}`;
  const hit = cache.get(key);
  if (hit) {
    return hit;
  }
  const perPin = targetCount / pinCount;
  const frames: number[] = new Array(pinCount).fill(COUNT_END);
  let next = 0;
  for (let f = COUNT_START; f <= COUNT_END && next < pinCount; f++) {
    const visible = visibleAtCount(countAtFrame(f, targetCount), perPin);
    while (next < Math.min(visible, pinCount)) {
      frames[next] = f;
      next++;
    }
  }
  cache.set(key, frames);
  return frames;
};

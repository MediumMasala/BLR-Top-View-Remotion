import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PINS} from '../data/pins';
import {getDropStartFrames} from '../lib/dropFrames';
import {Pin} from './Pin';

// Wave order is left-to-right by x, independent of drop order.
const waveOrder = new Map<number, number>(
  [...PINS]
    .sort((a, b) => a.x - b.x)
    .map((pin, i) => [pin.id, i] as [number, number])
);

export const PinField: React.FC<{
  targetCount: number;
  stageSize: number;
}> = ({targetCount, stageSize}) => {
  const dropStarts = getDropStartFrames(targetCount, PINS.length);
  return (
    <AbsoluteFill>
      {PINS.map((pin, i) => (
        <Pin
          key={pin.id}
          pin={pin}
          dropStartFrame={dropStarts[i]}
          stageSize={stageSize}
          waveIndex={waveOrder.get(pin.id) ?? 0}
        />
      ))}
    </AbsoluteFill>
  );
};

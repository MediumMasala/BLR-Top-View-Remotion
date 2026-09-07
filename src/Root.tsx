import React from 'react';
import {Composition} from 'remotion';
import {TalPinDrop, talSchema} from './TalPinDrop';
import {TalRingCount} from './TalRingCount';

const defaultProps = {
  city: 'Bangalore',
  targetCount: 500,
  role: 'Engineering Managers',
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TalPinDrop"
        component={TalPinDrop}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={defaultProps}
        schema={talSchema}
      />
      <Composition
        id="TalRingCount"
        component={TalRingCount}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={defaultProps}
        schema={talSchema}
      />
      <Composition
        id="TalPinDrop-9x16"
        component={TalPinDrop}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        schema={talSchema}
      />
      <Composition
        id="TalPinDrop-16x9"
        component={TalPinDrop}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
        schema={talSchema}
      />
    </>
  );
};

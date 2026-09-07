import React, {useState} from 'react';
import {
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {colors} from '../data/theme';
import type {Pin as PinData} from '../data/pins';

const LAND = 17; // local frame at which the spring visually touches down
const WAVE_START = 136;

// Pin body is authored at 96x124; the tip is at (48, 124).
const W = 96;
const H = 124;

const LogoCircle: React.FC<{logo: string; opacity: number; scale: number}> = ({
  logo,
  opacity,
  scale,
}) => {
  const [failed, setFailed] = useState(false);
  const letter = logo.replace(/\.[a-z]+$/i, '').charAt(0).toUpperCase();
  return (
    <div
      style={{
        position: 'absolute',
        left: 9,
        top: 7,
        width: 78,
        height: 78,
        borderRadius: '50%',
        overflow: 'hidden',
        background: colors.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {failed ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#3E4B8C',
            color: colors.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Poppins',
            fontWeight: 800,
            fontSize: 40,
          }}
        >
          {letter}
        </div>
      ) : (
        <Img
          src={staticFile(`logos/${logo}`)}
          pauseWhenLoading
          onError={() => setFailed(true)}
          style={{
            width: '78%',
            height: '78%',
            objectFit: 'contain',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  );
};

export const Pin: React.FC<{
  pin: PinData;
  dropStartFrame: number;
  stageSize: number;
  waveIndex: number;
}> = ({pin, dropStartFrame, stageSize, waveIndex}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const local = frame - dropStartFrame;
  if (local < 0) {
    return null;
  }

  const pinScale = (0.34 + pin.depth * 0.86) * pin.size * (stageSize / 1080);

  // Fall in from above with a deliberate overshoot
  const drop = spring({
    frame: local,
    fps,
    config: {damping: 13, mass: 0.85, stiffness: 120},
  });
  const dropY = interpolate(drop, [0, 1], [-220, 0]);
  const bodyOpacity = interpolate(local, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Landing squash (conserve volume)
  const squashY =
    local < LAND
      ? 1
      : interpolate(local, [LAND, LAND + 8], [0.88, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const squashX =
    local < LAND
      ? 1
      : interpolate(local, [LAND, LAND + 8], [1.06, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

  // Ripple ring at the tip on land
  const rippleT = interpolate(local, [LAND, LAND + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rippleScale = rippleT * 2.2;
  const rippleOpacity = 0.5 * (1 - rippleT);

  // Ground shadow fades in as the pin lands
  const shadowOpacity = interpolate(local, [LAND, LAND + 8], [0, 0.28], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ambient drift, ramped in after landing so there is no pop; runs forever
  // (nothing on screen may be fully static)
  const driftRamp = interpolate(local, [LAND + 6, LAND + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const drift = Math.sin((frame + pin.phase) / 34) * 2 * driftRamp;

  // Pin wave at the 500 moment, staggered left-to-right
  const waveStart = WAVE_START + waveIndex * 1.5;
  const wave = interpolate(
    frame,
    [waveStart, waveStart + 7, waveStart + 14],
    [1, 1.07, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease)}
  );

  // Live dot: solid until the wave, then a phase-offset blink loop
  const dotOpacity =
    frame >= WAVE_START
      ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame / 9 + pin.phase))
      : 1;

  const tipX = pin.x * stageSize;
  const tipY = pin.y * stageSize;

  return (
    <div
      style={{
        position: 'absolute',
        left: tipX,
        top: tipY,
        width: 0,
        height: 0,
        zIndex: Math.round(pin.depth * 100),
      }}
    >
      {/* ground shadow — stays put, does not ride the drift */}
      <div
        style={{
          position: 'absolute',
          left: -32 * pinScale,
          top: -9 * pinScale,
          width: 64 * pinScale,
          height: 18 * pinScale,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 70%)',
          opacity: shadowOpacity,
        }}
      />
      {/* scaled pin space: origin at the tip */}
      <div
        style={{
          position: 'absolute',
          left: -W / 2,
          top: -H,
          width: W,
          height: H,
          transform: `scale(${pinScale})`,
          transformOrigin: `${W / 2}px ${H}px`,
        }}
      >
        {/* ripple ring at the tip */}
        <div
          style={{
            position: 'absolute',
            left: W / 2 - 30,
            top: H - 22,
            width: 60,
            height: 34,
            borderRadius: '50%',
            border: `4px solid ${colors.white}`,
            opacity: rippleOpacity,
            transform: `scale(${rippleScale})`,
            transformOrigin: '50% 65%',
          }}
        />
        {/* falling + squashing + pulsing body */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: bodyOpacity,
            transform: `translateY(${dropY + drift}px) scale(${
              squashX * wave
            }, ${squashY * wave})`,
            transformOrigin: `${W / 2}px ${H}px`,
          }}
        >
          <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            style={{
              position: 'absolute',
              inset: 0,
              filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.35))',
            }}
          >
            <path
              d="M48 124 C34 96 4 78 4 46 A44 44 0 1 1 92 46 C92 78 62 96 48 124 Z"
              fill={colors.pinBlack}
            />
            <circle cx="48" cy="46" r="39" fill={colors.white} />
          </svg>
          <LogoCircle logo={pin.logo} opacity={1} scale={1} />
          {/* live dot, bottom-right of the logo circle */}
          <div
            style={{
              position: 'absolute',
              left: 64,
              top: 62,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: colors.liveGreen,
              border: `3px solid ${colors.white}`,
              boxSizing: 'border-box',
              opacity: dotOpacity,
            }}
          />
        </div>
      </div>
    </div>
  );
};

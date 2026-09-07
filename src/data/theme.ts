export const colors = {
  pinRed: '#E54333',
  pinBlack: '#17191E',
  liveGreen: '#00BF63',
  cream: '#FAF8DE',
  white: '#FFFFFF',
  scrim: 'rgba(6,10,20,0.42)',
} as const;

export const type = {
  headlineSize: 92,
  headlineLineHeight: 0.94,
  headlineTracking: '-0.025em',
  counterSize: 108,
  sublineSize: 34,
} as const;

// Base design space is a 1080x1080 square. Other formats scale off this.
export const DESIGN = 1080;

export type Pin = {
  id: number;
  x: number; // 0-1 normalised, position of the pin TIP
  y: number; // 0-1 normalised, position of the pin TIP
  depth: number; // 0 = far background, 1 = foreground
  logo: string; // filename in public/logos
  phase: number; // 0-100, seeds ambient drift + dot blink
  size: number; // per-pin size variance so the field reads organic, not graded
};

// Hand-placed on bg/skyline-bangalore.png. BUILDINGS ONLY:
// no pins on greenery/tree mass, none on Vidhana Soudha (palace,
// x 0-0.38 / y 0.58-0.80). 16 pins — letter-placeholder logos (wework/angelone/uc/
// myntra/payu) and freshworks/zerodha/cred removed; everything upsized ~2x and
// re-spaced. Effective scale = (0.34 + depth*0.86) * size.
// Array order = drop order (interleaved across zones so the fill scatters).
export const PINS: Pin[] = [
  {id: 0, x: 0.14, y: 0.44, depth: 0.08, logo: 'meta.png', phase: 12, size: 2.45},
  {id: 1, x: 0.48, y: 0.445, depth: 0.08, logo: 'intuit.png', phase: 29, size: 1.96},
  {id: 2, x: 0.075, y: 0.575, depth: 0.3, logo: 'bigbasket.png', phase: 43, size: 2.02},
  {id: 3, x: 0.755, y: 0.578, depth: 0.55, logo: 'phonepe.png', phase: 86, size: 1.1},
  {id: 4, x: 0.21, y: 0.555, depth: 0.12, logo: 'headout.png', phase: 71, size: 2.14},
  {id: 5, x: 0.665, y: 0.8, depth: 0.8, logo: 'zomato.png', phase: 66, size: 1.51},
  {id: 6, x: 0.32, y: 0.478, depth: 0.15, logo: 'paytm.png', phase: 81, size: 2.24},
  {id: 7, x: 0.65, y: 0.625, depth: 0.4, logo: 'swiggy.png', phase: 33, size: 1.42},
  {id: 8, x: 0.065, y: 0.685, depth: 0.45, logo: 'meesho.png', phase: 2, size: 1.72},
  {id: 9, x: 0.79, y: 0.447, depth: 0.14, logo: 'rippling.png', phase: 4, size: 1.85},
  {id: 10, x: 0.635, y: 0.478, depth: 0.06, logo: 'ola.png', phase: 63, size: 2.55},
  {id: 11, x: 0.88, y: 0.598, depth: 0.42, logo: 'flipkart.png', phase: 59, size: 1.28},
  {id: 12, x: 0.875, y: 0.885, depth: 0.95, logo: 'zepto.png', phase: 98, size: 1.38},
  {id: 13, x: 0.945, y: 0.5, depth: 0.22, logo: 'swish.png', phase: 17, size: 1.98},
  {id: 14, x: 0.825, y: 0.695, depth: 0.5, logo: 'razorpay.png', phase: 90, size: 1.62},
];

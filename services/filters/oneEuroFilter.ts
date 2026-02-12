/**
 * One Euro Filter — TypeScript Implementation
 *
 * Reduces jitter in real-time keypoint tracking with minimal latency.
 * Based on: Casiez, Roussel & Vogel (CHI 2012)
 * https://gery.casiez.net/1euro/
 *
 * Used to smooth MediaPipe pose landmarks before angle calculation.
 *
 * Tuning guide:
 *   - Decrease minCutoff → reduces jitter at slow speeds (must be > 0)
 *   - Increase beta → reduces lag at high speeds
 *   - Start: minCutoff=1.0, beta=0.0, then adjust
 */

function smoothingFactor(te: number, cutoff: number): number {
  const r = 2 * Math.PI * cutoff * te;
  return r / (r + 1);
}

function exponentialSmoothing(a: number, x: number, xPrev: number): number {
  return a * x + (1 - a) * xPrev;
}

export class OneEuroFilter {
  private minCutoff: number;
  private beta: number;
  private dCutoff: number;
  private xPrev: number;
  private dxPrev: number;
  private tPrev: number;
  private initialized: boolean;

  constructor(
    minCutoff: number = 1.0,
    beta: number = 0.007,
    dCutoff: number = 1.0,
  ) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
    this.xPrev = 0;
    this.dxPrev = 0;
    this.tPrev = 0;
    this.initialized = false;
  }

  filter(t: number, x: number): number {
    if (!this.initialized) {
      this.xPrev = x;
      this.dxPrev = 0;
      this.tPrev = t;
      this.initialized = true;
      return x;
    }

    const te = t - this.tPrev;
    if (te <= 0) return this.xPrev;

    // Filter the derivative
    const ad = smoothingFactor(te, this.dCutoff);
    const dx = (x - this.xPrev) / te;
    const dxHat = exponentialSmoothing(ad, dx, this.dxPrev);

    // Filter the signal
    const cutoff = this.minCutoff + this.beta * Math.abs(dxHat);
    const a = smoothingFactor(te, cutoff);
    const xHat = exponentialSmoothing(a, x, this.xPrev);

    // Store
    this.xPrev = xHat;
    this.dxPrev = dxHat;
    this.tPrev = t;

    return xHat;
  }

  reset(): void {
    this.initialized = false;
  }
}

/**
 * Multi-dimensional One Euro Filter for 3D landmarks.
 * Creates one filter per axis (x, y, z).
 */
export class LandmarkFilter {
  private filterX: OneEuroFilter;
  private filterY: OneEuroFilter;
  private filterZ: OneEuroFilter;

  constructor(minCutoff = 1.0, beta = 0.007) {
    this.filterX = new OneEuroFilter(minCutoff, beta);
    this.filterY = new OneEuroFilter(minCutoff, beta);
    this.filterZ = new OneEuroFilter(minCutoff, beta);
  }

  filter(
    t: number,
    point: { x: number; y: number; z: number }
  ): { x: number; y: number; z: number } {
    return {
      x: this.filterX.filter(t, point.x),
      y: this.filterY.filter(t, point.y),
      z: this.filterZ.filter(t, point.z),
    };
  }

  reset(): void {
    this.filterX.reset();
    this.filterY.reset();
    this.filterZ.reset();
  }
}

/**
 * Create a bank of 33 landmark filters (one per MediaPipe pose landmark).
 * Reuse across frames — call reset() when starting a new exercise.
 */
export function createPoseFilterBank(
  minCutoff = 1.0,
  beta = 0.007
): LandmarkFilter[] {
  const LANDMARK_COUNT = 33;
  return Array.from({ length: LANDMARK_COUNT }, () =>
    new LandmarkFilter(minCutoff, beta)
  );
}

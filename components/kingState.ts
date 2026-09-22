/**
 * Fixed pixel size of the king's stage. The WebGL canvas is locked to this and
 * never resized: React Three Fiber measures its container with a
 * ResizeObserver, so applying a CSS scale to the stage would make it shrink the
 * drawing buffer to match and scale the king a second time. Size is driven
 * inside the 3D scene instead.
 */
export const STAGE = 360

/**
 * Shared mutable channel between the scroll orchestrator (PersistentKing) and
 * the render loop (KingScene). Deliberately not React state: this updates every
 * frame and must never trigger a re-render.
 */
export const kingState = {
  /** 1 = full ambient rotation, 0 = frozen. Eased down as the king lands. */
  spin: 1,
  /** Intended on-screen size in px, expressed as a stage box. */
  size: STAGE,
}

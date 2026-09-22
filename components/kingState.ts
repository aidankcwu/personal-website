/**
 * Shared mutable channel between the scroll orchestrator (PersistentKing) and
 * the render loop (KingScene). Deliberately not React state: this updates every
 * frame and must never trigger a re-render.
 */
export const kingState = {
  /**
   * Where the king rests before the landing, as a signed fraction of viewport
   * height above the centre of the screen. Tracks its slot in the info block
   * while that slot is below centre, then holds at 0 — in flow, then pinned.
   * Starts well below the fold so nothing shows over the hero.
   */
  parkOffset: -2,
  /** Smoothed scroll speed in px/s. Positive is scrolling down. */
  scrollVelocity: 0,
  /** 0 = parked and spinning, 1 = landed on the board. Scroll-linked. */
  landed: 0,
  /** Index of the active square. */
  index: 0,
  /** Set to 1 on each move and decayed by the scene — drives the lift arc. */
  hop: 0,
  /** True once the user has asked for reduced motion. */
  still: false,
  /** Registered by the scene so the orchestrator can drive on-demand renders. */
  invalidate: undefined as (() => void) | undefined,
}

type FrameCallback = (time: number) => void
type Entry = { cb: FrameCallback; order: number }

/**
 * One requestAnimationFrame loop for the whole page, with explicit ordering.
 *
 * Ordering is the point. The smooth-scroll layer writes the scroll position
 * during its callback, and the king reads that position to place itself. Two
 * independent rAF loops would run in registration order, so the king could
 * read a position the scroll layer hadn't written yet and trail it by a frame.
 * Lower `order` runs first.
 */
const entries: Entry[] = []
let raf = 0

function tick(time: number) {
  raf = requestAnimationFrame(tick)
  for (const entry of entries) entry.cb(time)
}

export const FRAME_ORDER = {
  /** Writes the scroll position. */
  scroll: 0,
  /** Reads it. */
  readers: 10,
} as const

export function onFrame(cb: FrameCallback, order: number = FRAME_ORDER.readers) {
  entries.push({ cb, order })
  entries.sort((a, b) => a.order - b.order)
  if (!raf) raf = requestAnimationFrame(tick)

  return () => {
    const index = entries.findIndex((entry) => entry.cb === cb)
    if (index !== -1) entries.splice(index, 1)
    if (entries.length === 0 && raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
  }
}

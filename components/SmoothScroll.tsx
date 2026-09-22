'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { FRAME_ORDER, onFrame } from './frameLoop'

/**
 * Interpolates the scroll position instead of letting it jump.
 *
 * A wheel notch is quantised — roughly 100px delivered as one event — so the
 * page teleports. Every animation here is a function of scroll, so they
 * teleport with it. Lenis keeps its own target and eases the real position
 * toward it each frame, which turns one notch into a glide and makes
 * everything downstream continuous.
 *
 * It drives the real window scroll rather than transforming a wrapper
 * element, which is why the pinned projects section keeps working —
 * transform-based smooth scrolling breaks position: sticky.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      // Shorter than the default 1.2: long durations are what make smooth
      // scrolling feel floaty and disconnected from the wheel.
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Touch devices already have native momentum worth keeping.
      syncTouch: false,
      anchors: true,
    })

    const stop = onFrame((time) => lenis.raf(time), FRAME_ORDER.scroll)

    return () => {
      stop()
      lenis.destroy()
    }
  }, [])

  return null
}

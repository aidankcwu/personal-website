import type Lenis from 'lenis'

/**
 * Scroll locking has to go through the smooth-scroll layer, not just CSS.
 * Lenis drives the scroll position itself, so `overflow: hidden` alone leaves
 * it happily scrolling the page behind a modal. Both are needed: stop() for
 * Lenis, and the class for native scrolling when Lenis is switched off.
 */
let lenis: Lenis | null = null
let locks = 0

export function registerLenis(instance: Lenis | null) {
  lenis = instance
}

export function lockScroll() {
  locks += 1
  if (locks > 1) return
  lenis?.stop()
  document.documentElement.classList.add('scroll-locked')
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks > 0) return
  lenis?.start()
  document.documentElement.classList.remove('scroll-locked')
}

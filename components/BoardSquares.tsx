'use client'

import { useEffect, useRef } from 'react'
import { featuredProjects } from '@/data/projects'
import { onFrame } from './frameLoop'
import { kingState } from './kingState'
import { scrollToY } from './scrollLock'

/**
 * A click target over each board square, so the board doubles as a jump bar
 * for the carousel.
 *
 * These are DOM buttons rather than 3D hit-testing, on purpose. The canvas
 * covers the whole viewport, so turning on its pointer events swallows every
 * link and text selection on the page — exactly the bug the `.king-stage *`
 * pointer-events rule exists to prevent. Projecting the squares out to screen
 * coordinates leaves the canvas inert and gets real focusable, keyboard-
 * operable controls for free.
 *
 * Positions are written straight to style rather than through state: they
 * change every frame while the board settles, and a re-render per frame would
 * be wasted work.
 */
export default function BoardSquares() {
  const layerRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])
  const labelRef = useRef<HTMLSpanElement>(null)
  const hovered = useRef(-1)

  useEffect(() => {
    return onFrame(() => {
      const layer = layerRef.current
      if (!layer) return

      // Only live once the board has actually faded in. Hidden rather than
      // made transparent, so the buttons leave the tab order with it.
      const live = kingState.boardReveal > 0.9
      layer.style.display = live ? '' : 'none'
      if (!live) return

      const boxes = kingState.squares
      for (let i = 0; i < buttonsRef.current.length; i += 1) {
        const el = buttonsRef.current[i]
        const box = boxes[i]
        if (!el || !box) continue
        el.style.transform = `translate(${box.x}px, ${box.y}px)`
        el.style.width = `${box.w}px`
        el.style.height = `${box.h}px`
      }

      // The label is the only thing telling you the squares can be clicked, so
      // it tracks whichever one is under the cursor or focused.
      const label = labelRef.current
      const box = hovered.current >= 0 ? boxes[hovered.current] : undefined
      if (label) {
        label.style.opacity = box ? '1' : '0'
        if (box) {
          // Below the board, not above it. Above puts the label straight
          // through the king, which stands a good square and a half tall; the
          // gap between the card text and the king's head is too tight to
          // clear it. Offset scales with square width so it tracks the board
          // at any viewport size.
          const below = box.y + box.h + box.w * 0.35
          label.style.transform =
            `translate(${box.x + box.w / 2}px, ${below}px) translate(-50%, 0)`
        }
      }
    })
  }, [])

  const setHover = (index: number, title?: string) => {
    hovered.current = index
    const label = labelRef.current
    if (label && title) label.textContent = title
  }

  const jumpTo = (index: number) => {
    const pin = document.getElementById('projects')
    if (!pin) return
    const travel = pin.getBoundingClientRect().height - window.innerHeight
    if (travel <= 0) return
    // The carousel turns scroll into a card index; this runs that mapping
    // backwards to land on the scroll position that rounds to `index`.
    const count = featuredProjects.length
    const progress = count > 1 ? index / (count - 1) : 0
    scrollToY(pin.getBoundingClientRect().top + window.scrollY + progress * travel)
  }

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-30"
      style={{ display: 'none' }}
    >
      <span
        ref={labelRef}
        aria-hidden="true"
        className="absolute left-0 top-0 whitespace-nowrap text-[0.625rem] uppercase tracking-[0.22em] text-faint opacity-0 transition-opacity duration-200 motion-reduce:transition-none"
      />

      {featuredProjects.map((project, i) => (
        <button
          key={project.slug}
          ref={(el) => {
            buttonsRef.current[i] = el
          }}
          type="button"
          onClick={() => jumpTo(i)}
          onPointerEnter={() => setHover(i, project.title)}
          onPointerLeave={() => setHover(-1)}
          onFocus={() => setHover(i, project.title)}
          onBlur={() => setHover(-1)}
          className="pointer-events-auto absolute left-0 top-0 cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          <span className="sr-only">{`Go to project ${i + 1}, ${project.title}`}</span>
        </button>
      ))}
    </div>
  )
}

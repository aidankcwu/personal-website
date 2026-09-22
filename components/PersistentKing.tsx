'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { STAGE, kingState } from './kingState'

const KingScene = dynamic(() => import('./KingScene'), { ssr: false })

/**
 * Distance from the stage centre to the king's base, as a fraction of stage
 * size. Derived from the camera: a 30deg fov at z=4 shows 2.144 world units,
 * the model is fitted to 1.85 of them, so half its height is 0.43 of the stage.
 */
const BASE_OFFSET = 0.43

/** King height on the board, as a multiple of one square. */
const BOARD_SCALE = 1.5

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export default function PersistentKing({ projectCount }: { projectCount: number }) {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    const cur = { x: 0, y: 0, ready: false }
    let hop = 0
    let lastIndex = 0

    const frame = () => {
      raf = requestAnimationFrame(frame)

      // Resolved per frame rather than cached: cheap, and it means the king
      // picks up its anchors whenever they mount.
      const info = document.getElementById('king-anchor-info')
      const word = document.getElementById('king-anchor-wordmark')
      const board = document.getElementById('king-board')
      const pin = document.getElementById('projects')
      if (!info || !word || !board || !pin) return

      const vh = window.innerHeight
      const ri = info.getBoundingClientRect()
      const rw = word.getBoundingClientRect()
      const rb = board.getBoundingClientRect()
      const rp = pin.getBoundingClientRect()

      const square = rb.width / projectCount
      const parkSize = clamp(window.innerWidth * 0.2, 170, 300)
      const boardSize = square * BOARD_SCALE

      // Waypoint A — parked in the info block's centre column.
      const ax = ri.left + ri.width / 2
      const ay = ri.top + ri.height / 2
      // Waypoint B — the centre of the "Projects" wordmark.
      const bx = rw.left + rw.width / 2
      const by = rw.top + rw.height / 2

      // A and B are both in normal flow, so their separation is constant. t1 is
      // 0 when A is viewport-centred and 1 when B is.
      const span = by - ay
      const t1 = span > 1 ? clamp((vh / 2 - ay) / span, 0, 1) : 0

      // t2 ramps over the last 0.7vh of the approach and hits 1 exactly as the
      // carousel pins.
      const t2 = clamp(1 - rp.top / (vh * 0.7), 0, 1)

      // Same quantisation as the carousel, so king and cards always agree.
      const travel = rp.height - vh
      const progress = travel > 0 ? clamp(-rp.top / travel, 0, 1) : 0
      const index =
        projectCount > 1 ? Math.round(progress * (projectCount - 1)) : 0

      if (index !== lastIndex) {
        hop = 1
        lastIndex = index
      }
      hop *= 0.86

      // Waypoint C — standing on the active square.
      const cx = rb.left + (index + 0.5) * square
      const cy = rb.top + rb.height / 2 - boardSize * BASE_OFFSET

      const size = lerp(parkSize, boardSize, t2)
      const tx = lerp(lerp(ax, bx, t1), cx, t2)
      let ty = lerp(lerp(ay, by, t1), cy, t2)

      // Lift-and-place arc: a move is a hop, not a slide.
      if (!reduceMotion) {
        ty -= Math.sin(hop * Math.PI) * square * 0.6 * t2
      }

      if (!cur.ready) {
        cur.x = tx
        cur.y = ty
        cur.ready = true
      }
      const ease = reduceMotion ? 1 : 0.22
      cur.x += (tx - cur.x) * ease
      cur.y += (ty - cur.y) * ease

      const opacity = clamp((vh - ri.top) / (vh * 0.35), 0, 1)

      // Translation only — see the note on STAGE. Scale is handed to the scene.
      stage.style.transform = `translate3d(${cur.x - STAGE / 2}px, ${
        cur.y - STAGE / 2
      }px, 0)`
      stage.style.opacity = String(opacity)

      kingState.size = size
      kingState.spin = reduceMotion ? 0 : 1 - t2
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [projectCount])

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-20 opacity-0"
      style={{ width: STAGE, height: STAGE, willChange: 'transform' }}
    >
      <KingScene />
    </div>
  )
}

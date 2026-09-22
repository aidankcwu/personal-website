'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { kingState } from './kingState'

const KingScene = dynamic(() => import('./KingScene'), { ssr: false })

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/**
 * Positions nothing. The canvas is full-viewport and every transform happens in
 * 3D, so this only reads scroll landmarks and hands the scene a few numbers.
 *
 * The king behaves like a sticky element: in flow with the info block's centre
 * column on the way in, then pinned at the centre of the screen once the column
 * gets there, then released into the landing. Nothing is eased toward a
 * scroll-driven target — that easing is what made an earlier version
 * rubber-band — so the in-flow phase tracks scroll exactly, the way a normal
 * element would, and the pin is a hard clamp.
 */
export default function PersistentKing({ projectCount }: { projectCount: number }) {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    kingState.still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let lastIndex = 0

    const frame = () => {
      raf = requestAnimationFrame(frame)

      const slot = document.getElementById('king-slot')
      const pin = document.getElementById('projects')
      if (!slot || !pin) return

      const vh = window.innerHeight
      const rs = slot.getBoundingClientRect()
      const rp = pin.getBoundingClientRect()

      // In flow while the slot sits below the middle of the screen, pinned once
      // it arrives. max() is the whole sticky behaviour: follow the slot down
      // there, clamp at centre from then on. No fade — the king simply scrolls
      // up into frame the way the text beside it does.
      const slotCentre = rs.top + rs.height / 2
      const restY = Math.max(vh / 2, slotCentre)
      kingState.parkOffset = (vh / 2 - restY) / vh

      // Landing runs over the last half-viewport of the approach and completes
      // exactly as the carousel pins. Kept short so the descending king spends
      // as little time as possible crossing the incoming card.
      kingState.landed = clamp(1 - rp.top / (vh * 0.5), 0, 1)

      // Same quantisation as the carousel, so king and cards always agree.
      const travel = rp.height - vh
      const progress = travel > 0 ? clamp(-rp.top / travel, 0, 1) : 0
      const index = projectCount > 1 ? Math.round(progress * (projectCount - 1)) : 0
      if (index !== lastIndex) {
        kingState.hop = 1
        lastIndex = index
      }
      kingState.index = index

      // frameloop is on demand, so the GPU stays idle until the king could
      // actually be in frame.
      if (restY < vh * 1.25 || kingState.landed > 0) kingState.invalidate?.()
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [projectCount])

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="king-stage pointer-events-none fixed inset-0 z-20"
    >
      <KingScene count={projectCount} />
    </div>
  )
}

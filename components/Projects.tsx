'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { featuredProjects } from '@/data/projects'
import ProjectCard from './ProjectCard'
import { scrollToY } from './scrollLock'

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export default function Projects() {
  const projects = featuredProjects
  const count = projects.length
  const pinRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  /**
   * The card an arrow press is heading for, which is not yet `index` — that
   * only catches up once the scroll animation has moved far enough. Without
   * it, two quick presses both step from the same card and the second is
   * swallowed.
   */
  const pending = useRef<number | null>(null)

  // Vertical scroll drives horizontal position, but quantised: the scroll is
  // continuous while the cards advance in discrete steps. One step is one move.
  useEffect(() => {
    const el = pinRef.current
    if (!el || count < 2) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) return
      const progress = Math.min(1, Math.max(0, -rect.top / travel))
      const next = Math.round(progress * (count - 1))
      setIndex(next)
      if (pending.current === next) pending.current = null
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    // A wheel or touch means the user has taken over, so any arrow-key target
    // still in flight is no longer what they want.
    const onManual = () => {
      pending.current = null
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('wheel', onManual, { passive: true })
    window.addEventListener('touchstart', onManual, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('wheel', onManual)
      window.removeEventListener('touchstart', onManual)
    }
  }, [count])

  // Left and right step between cards. The section reads as horizontal, so the
  // arrow keys are the first thing reached for; without this they do nothing
  // and the only way through is a vertical scroll the layout never signposts.
  useEffect(() => {
    const el = pinRef.current
    if (!el || count < 2) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

      // Leave the keys alone unless the pinned section owns the screen, or
      // they'd hijack arrow presses meant for the rest of the page.
      const rect = el.getBoundingClientRect()
      if (rect.top > 0 || rect.bottom < window.innerHeight) return

      // And leave them alone inside a field or a native control.
      const active = document.activeElement
      if (
        active instanceof HTMLElement &&
        (active.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName))
      ) {
        return
      }

      const from = pending.current ?? index
      const next = clamp(from + (event.key === 'ArrowRight' ? 1 : -1), 0, count - 1)
      if (next === from) return

      const travel = rect.height - window.innerHeight
      if (travel <= 0) return

      event.preventDefault()
      pending.current = next
      scrollToY(rect.top + window.scrollY + (next / (count - 1)) * travel)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [count, index])

  return (
    <>
      {/* Wordmark band. Sits below the king's layer, so the king crosses in
          front of the letterforms rather than being occluded by them. */}
      <section className="flex min-h-screen items-center justify-center overflow-hidden">
        <h2
          className="relative z-10 text-center text-[clamp(4.5rem,17vw,14rem)] leading-none tracking-[-0.03em] text-ink"
        >
          Projects
        </h2>
      </section>

      {/* Pinned carousel. Section height sets the scroll budget: one viewport
          of scroll per move. */}
      <section
        ref={pinRef}
        id="projects"
        style={{ height: `${count * 100}vh` }}
        className="relative"
      >
        {/* Cards sit in the upper part of the pinned viewport; the board is
            rendered in 3D below them, not in the DOM. */}
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pb-[18vh]">
          <motion.div
            className="relative z-10 flex"
            animate={{ x: `${-index * 100}vw` }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {projects.map((project, i) => (
              <div
                key={project.slug}
                className="flex w-screen shrink-0 justify-center px-6 md:px-16"
              >
                <ProjectCard project={project} index={i} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}

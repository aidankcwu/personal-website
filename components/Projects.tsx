'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { featuredProjects } from '@/data/projects'
import ProjectCard from './ProjectCard'

export default function Projects() {
  const projects = featuredProjects
  const count = projects.length
  const pinRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

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
      setIndex(Math.round(progress * (count - 1)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [count])

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

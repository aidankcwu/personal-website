'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import WavyBackground from './WavyBackground'

const socialLinks = [
  {
    label: 'LinkedIn',
    href: '#',
    target: '_blank',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Resume',
    href: '/resume.pdf',
    target: '_blank',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    target: '_blank',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:placeholder@example.com',
    target: undefined,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-400, 400], [6, -6])
  const rotateY = useTransform(mouseX, [-600, 600], [-6, 6])

  const glareX = useTransform(mouseX, [-600, 600], [20, 80])
  const glareY = useTransform(mouseY, [-400, 400], [20, 80])
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.06), transparent 55%)`
  )

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section
      className="relative flex items-center min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <WavyBackground />

      <div className="relative z-10 px-6 pt-20 max-w-3xl mx-auto w-full">
        <div style={{ perspective: '1200px' }}>
          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="relative p-8 rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md"
          >
            {/* glare overlay */}
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ background: glare }}
            />

            <p className="text-neutral-500 text-xs mb-3 tracking-widest uppercase">
              Software Engineer
            </p>
            <h1 className="text-5xl font-bold tracking-tight text-neutral-100 mb-5">
              Hi, I&apos;m Aidan.
            </h1>
            <p className="text-lg text-neutral-400 leading-relaxed">
              I&apos;m a [year] studying [major] at [university]. I spend most of my time building
              software, thinking about [topic], and occasionally losing at chess. My work tends to
              live at the intersection of [field A] and [field B] — I&apos;m drawn to problems where
              there&apos;s a hard technical challenge sitting behind a clear real-world impact.
            </p>

            <div className="border-t border-neutral-700/50 my-6" />

            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.target}
                  rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="flex flex-col items-center gap-1.5 w-14 group"
                >
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl border border-neutral-700 bg-neutral-800/60 text-neutral-400 group-hover:border-neutral-500 group-hover:text-neutral-200 transition-colors">
                    {link.icon}
                  </span>
                  <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400 transition-colors">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

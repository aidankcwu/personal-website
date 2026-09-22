'use client'

import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import WavyBackground from './WavyBackground'
import HeroLink from './HeroLink'

const EMAIL = 'samuraishibe1@gmail.com'

const externalLinks = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Resume', href: '/resume.pdf' },
  { label: 'GitHub', href: '#' },
]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const emailButtonClass = [
  'group relative inline-flex items-center text-neutral-400 transition-colors duration-300',
  "before:pointer-events-none before:absolute before:left-0 before:top-[1.45em] before:h-px before:w-full before:bg-current before:content-['']",
  'before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]',
  'hover:text-purple-300 hover:before:origin-left hover:before:scale-x-100',
  'cursor-pointer italic',
].join(' ')

export default function Hero() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <section className="relative flex items-center min-h-screen overflow-hidden">
      <WavyBackground />

      <motion.div
        className="relative z-10 pl-6 md:pl-16 lg:pl-24 pr-6 pt-32 max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={itemVariants}
          className="text-[11px] text-neutral-500 mb-8 tracking-[0.25em] uppercase"
        >
          Software Engineer
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="italic text-7xl md:text-8xl tracking-tight text-neutral-100 mb-10 leading-[0.95]"
        >
          Aidan<span className="text-purple-400 not-italic">.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-neutral-400 leading-relaxed mb-12 max-w-md"
        >
          I&apos;m a [year] studying [major] at [university]. I spend most of my time
          building software, thinking about [topic], and occasionally losing at chess.
          My work tends to live at the intersection of [field A] and [field B] —
          drawn to problems where there&apos;s a hard technical challenge behind a
          clear real-world impact.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex items-center flex-wrap gap-x-3 gap-y-2 text-sm italic text-neutral-400"
        >
          {externalLinks.map((link, i) => (
            <span key={link.label} className="flex items-center gap-3">
              {i > 0 && <span className="text-neutral-700 not-italic">—</span>}
              <HeroLink href={link.href} external>
                {link.label}
              </HeroLink>
            </span>
          ))}
          <span className="flex items-center gap-3">
            <span className="text-neutral-700 not-italic">—</span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className={emailButtonClass}
              aria-label={copied ? 'Email copied to clipboard' : 'Copy email to clipboard'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? 'copied' : 'email'}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {copied ? 'Copied ✓' : 'Email'}
                </motion.span>
              </AnimatePresence>
            </button>
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll cue — minimal chevron near the bottom of the hero, gently
          bouncing. Sits on the left column to match the editorial left-justified
          composition. */}
      <a
        href="#projects"
        aria-label="Scroll to projects"
        className="absolute bottom-8 left-6 md:left-16 lg:left-24 z-10 text-neutral-400 hover:text-purple-300 transition-colors animate-[scroll-bounce_2s_ease-in-out_infinite]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  )
}

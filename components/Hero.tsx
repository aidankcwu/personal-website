'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WavyBackground from './WavyBackground'
import HeroLink, { linkClass } from './HeroLink'
import KineticTextReveal from './KineticTextReveal'

const EMAIL = 'talpo.n@northeastern.edu'

const INTRO =
  "I'm a [year] studying [major] at [university]. I spend most of my time building software, thinking about [topic], and occasionally losing at chess."

// The three reveals run back to back rather than overlapping, so the eye is
// led name -> intro -> links instead of taking in three moving things at once.
const INTRO_DELAY = 0.75
const LINKS_DELAY = 1.5

const links = [
  { label: 'LinkedIn', href: '#' },
  { label: 'GitHub', href: '#' },
  { label: 'Resume', href: '/resume.pdf' },
]

export default function Hero() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Back plane: cursor-reactive line field. The only moving thing in the
          hero, and the only element the page layers anything on top of. */}
      <WavyBackground />

      {/* Front plane: centered type block. */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h1 className="mb-8 text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.9] tracking-[-0.02em] text-ink">
          <KineticTextReveal
            text="Aidan Wu"
            splitBy="characters"
            distance={70}
            stagger={0.045}
            delay={0.15}
          />
        </h1>

        <p className="mb-10 max-w-[34rem] text-[0.975rem] leading-[1.75] text-muted">
          <KineticTextReveal
            text={INTRO}
            splitBy="words"
            distance={14}
            stagger={0.016}
            delay={INTRO_DELAY}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: LINKS_DELAY }}
        >
          {links.map((link) => (
            <HeroLink key={link.label} href={link.href} external>
              {link.label}
            </HeroLink>
          ))}
          <button
            type="button"
            onClick={handleCopyEmail}
            className={`${linkClass} cursor-pointer`}
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
                {copied ? 'Copied' : 'Email'}
              </motion.span>
            </AnimatePresence>
          </button>
        </motion.div>
      </div>
    </section>
  )
}

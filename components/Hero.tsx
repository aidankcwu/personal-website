'use client'

import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import WavyBackground from './WavyBackground'
import HeroLink, { linkClass } from './HeroLink'

const EMAIL = 'talpo.n@northeastern.edu'

const links = [
  { label: 'LinkedIn', href: '#' },
  { label: 'GitHub', href: '#' },
  { label: 'Resume', href: '/resume.pdf' },
]

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

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
      <motion.div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={item}
          className="mb-8 text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.9] tracking-[-0.02em] text-ink"
        >
          Aidan Wu
        </motion.h1>

        <motion.p
          variants={item}
          className="mb-10 max-w-[34rem] text-[0.975rem] leading-[1.75] text-muted"
        >
          I&apos;m a [year] studying [major] at [university]. I spend most of my time
          building software, thinking about [topic], and occasionally losing at chess.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm"
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
      </motion.div>
    </section>
  )
}

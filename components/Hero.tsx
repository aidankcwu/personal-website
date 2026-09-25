'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import WavyBackground from './WavyBackground'
import HeroLink, { linkClass } from './HeroLink'
import KineticTextReveal from './KineticTextReveal'

const EMAIL = 'talpo.n@northeastern.edu'

const INTRO =
  "I was born and raised in Hong Kong, and I'm currently studying CS and Operations Research at Rice University. I'm interested in all things AI, especially agentic AI and LLM research, as well as ML and data science. This past summer I worked at Linvest21 as an AI SWE intern, building out the infrastructure for their financial agents, and right now I'm part of OptimaLab at Rice, doing research on quantization and KV cache optimization for LLMs."

const OUTRO =
  "Outside of academics, I'm an ex-competitive chess player and chess coach, and I spend most of my free time weightlifting, playing poker, running long distance, and trying new food. Enjoy your stay :)"

// The reveals run back to back rather than overlapping, so the eye is led
// name -> intro -> outro -> links instead of taking in everything at once.
const INTRO_DELAY = 0.55
const OUTRO_DELAY = 1.45
const LINKS_DELAY = 2.45
const WORD_STAGGER = 0.012

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
        {/* Photo and name share one row. Sized in `em` so it tracks the
            name's clamp at every viewport width instead of needing its own
            breakpoints. No alt text: the heading beside it already says the
            name, and duplicating it would read the name twice. */}
        <h1 className="mb-8 flex items-center justify-center gap-[0.3em] text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.9] tracking-[-0.02em] text-ink">
          <motion.span
            className="block size-[0.62em] shrink-0 -translate-y-[0.07em] overflow-hidden rounded-full"
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <Image
              src="/images/aidan.jpg"
              alt=""
              width={512}
              height={512}
              sizes="168px"
              priority
              className="h-full w-full object-cover"
            />
          </motion.span>

          <KineticTextReveal
            text="Aidan Wu"
            splitBy="characters"
            distance={70}
            stagger={0.045}
            delay={0.15}
          />
        </h1>

        <p className="mb-4 max-w-[52rem] text-[0.975rem] leading-[1.75] text-muted">
          <KineticTextReveal
            text={INTRO}
            splitBy="words"
            distance={14}
            stagger={WORD_STAGGER}
            delay={INTRO_DELAY}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </p>

        <p className="mb-10 max-w-[52rem] text-[0.975rem] leading-[1.75] text-muted">
          <KineticTextReveal
            text={OUTRO}
            splitBy="words"
            distance={14}
            stagger={WORD_STAGGER}
            delay={OUTRO_DELAY}
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

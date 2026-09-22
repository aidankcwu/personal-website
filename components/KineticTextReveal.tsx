'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion, type Transition } from 'framer-motion'

type SplitBy = 'words' | 'characters' | 'lines'
type Direction = 'up' | 'down' | 'left' | 'right'
type StaggerFrom = 'start' | 'end' | 'center' | 'edges' | 'random' | number

type KineticTextRevealProps = {
  text: string
  splitBy?: SplitBy
  direction?: Direction
  /** Travel distance in px. */
  distance?: number
  /** Gap between segments in seconds. */
  stagger?: number
  staggerFrom?: StaggerFrom
  blur?: boolean
  autoPlay?: boolean
  /** Seconds before the first segment moves. */
  delay?: number
  transition?: Transition
  onRevealStart?: () => void
  onRevealComplete?: () => void
  className?: string
  segmentClassName?: string
  maskClassName?: string
}

const DEFAULT_TRANSITION: Transition = {
  duration: 0.85,
  ease: [0.22, 1, 0.36, 1],
}

function splitText(text: string, splitBy: SplitBy): string[] {
  if (splitBy === 'lines') return text.split('\n')
  if (splitBy === 'characters') return Array.from(text)
  return text.split(' ')
}

/** Offset a hidden segment starts from, so it travels *toward* `direction`. */
function hiddenOffset(direction: Direction, distance: number) {
  switch (direction) {
    case 'down':
      return { x: 0, y: -distance }
    case 'left':
      return { x: distance, y: 0 }
    case 'right':
      return { x: -distance, y: 0 }
    default:
      return { x: 0, y: distance }
  }
}

/**
 * Deterministic 0..1 from the text and a segment index. Used instead of
 * Math.random for the "random" order so the sequence is stable across
 * re-renders and identical on server and client.
 */
function hashUnit(seed: string, index: number): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  h ^= index
  h = Math.imul(h, 16777619)
  return ((h >>> 0) % 1024) / 1024
}

/** Position in the stagger queue — not the delay itself, just the ordering. */
function staggerIndex(index: number, total: number, from: StaggerFrom): number {
  if (typeof from === 'number') return Math.abs(index - from)
  const middle = (total - 1) / 2
  switch (from) {
    case 'end':
      return total - 1 - index
    case 'center':
      return Math.abs(index - middle)
    case 'edges':
      return middle - Math.abs(index - middle)
    default:
      return index
  }
}

export default function KineticTextReveal({
  text,
  splitBy = 'words',
  direction = 'up',
  distance = 20,
  stagger = 0.075,
  staggerFrom = 'start',
  blur = true,
  autoPlay = true,
  delay = 0,
  transition = DEFAULT_TRANSITION,
  onRevealStart,
  onRevealComplete,
  className,
  segmentClassName,
  maskClassName,
}: KineticTextRevealProps) {
  const reduceMotion = useReducedMotion()
  const segments = useMemo(() => splitText(text, splitBy), [text, splitBy])

  const randomOrder = useMemo(() => {
    if (staggerFrom !== 'random') return null
    return segments.map((_, i) => hashUnit(text, i))
  }, [segments, staggerFrom, text])

  // Motion off entirely rather than sped up: a blur-and-travel reveal has no
  // reduced-motion equivalent worth keeping.
  if (reduceMotion || !autoPlay) {
    return <span className={className}>{text}</span>
  }

  const offset = hiddenOffset(direction, distance)
  const lastIndex = segments.length - 1
  // Lines stack; words and characters sit on one flowing line.
  const isBlock = splitBy === 'lines'

  return (
    <span className={className}>
      {/* The animated copy is split across dozens of elements, which screen
          readers announce one fragment at a time. Expose the intact string and
          hide the pieces. */}
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {segments.map((segment, i) => {
          const order = randomOrder
            ? randomOrder[i] * lastIndex
            : staggerIndex(i, segments.length, staggerFrom)
          const segmentDelay = delay + order * stagger

          // A space split out as its own character stays unwrapped so the text
          // still breaks and wraps normally.
          if (segment === ' ' || segment === '') {
            return <span key={i}> </span>
          }

          return (
            <span key={i}>
              <span
                className={maskClassName}
                style={{
                  display: isBlock ? 'block' : 'inline-block',
                  overflow: 'hidden',
                  // The mask would otherwise crop descenders on g, y, p.
                  paddingBottom: '0.18em',
                  marginBottom: '-0.18em',
                }}
              >
                <motion.span
                  className={segmentClassName}
                  style={{
                    display: isBlock ? 'block' : 'inline-block',
                    willChange: 'transform, filter',
                  }}
                  initial={{
                    opacity: 0,
                    x: offset.x,
                    y: offset.y,
                    filter: blur ? 'blur(10px)' : 'blur(0px)',
                  }}
                  animate={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
                  transition={{ ...transition, delay: segmentDelay }}
                  onAnimationStart={i === 0 ? onRevealStart : undefined}
                  onAnimationComplete={i === lastIndex ? onRevealComplete : undefined}
                >
                  {segment}
                </motion.span>
              </span>
              {/* split(' ') drops the separators, so put them back between
                  words or everything runs together. */}
              {splitBy === 'words' && i < lastIndex ? ' ' : null}
            </span>
          )
        })}
      </span>
    </span>
  )
}

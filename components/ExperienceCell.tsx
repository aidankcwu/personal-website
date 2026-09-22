'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { experience, type ExperienceEntry } from '@/data/info'
import RevealOnScroll from './RevealOnScroll'
import { lockScroll, unlockScroll } from './scrollLock'

function ExperienceDialog({
  entry,
  onClose,
}: {
  entry: ExperienceEntry | null
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const open = entry !== null

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    if (open && !dialog.open) {
      // showModal, not show: it puts the dialog in the top layer, makes the
      // rest of the page inert, traps focus and wires up Esc — all behaviours
      // that are easy to reimplement badly.
      dialog.showModal()
      lockScroll()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => () => unlockScroll(), [])

  const handleClose = useCallback(() => {
    unlockScroll()
    onClose()
  }, [onClose])

  return (
    <dialog
      ref={ref}
      className="modal-panel w-[min(46rem,calc(100vw-3rem))] border border-rule bg-surface p-8 text-ink md:p-12"
      onClose={handleClose}
      onClick={(event) => {
        // Clicks that land on the backdrop are reported against the dialog
        // element itself, so this only fires outside the panel's content.
        if (event.target === ref.current) handleClose()
      }}
    >
      {entry && (
        <div onClick={(event) => event.stopPropagation()}>
          <div className="mb-8 flex items-start justify-between gap-8">
            <div>
              <p className="mb-2 text-[0.625rem] uppercase tracking-[0.22em] text-faint">
                {entry.company}
              </p>
              <h3 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight tracking-[-0.01em]">
                {entry.role}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="-mr-2 -mt-2 shrink-0 p-2 text-faint transition-colors duration-200 hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M2 2l12 12M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  fill="none"
                />
              </svg>
            </button>
          </div>

          <p className="mb-8 border-b border-rule pb-8 text-[0.8125rem] text-muted">
            {entry.location ? `${entry.location} · ` : ''}
            {entry.period}
          </p>

          <div className="flex flex-col gap-5">
            {entry.detail.map((line) => (
              <p key={line} className="text-[0.9375rem] leading-[1.7] text-muted">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </dialog>
  )
}

export default function ExperienceCell({ delay = 0 }: { delay?: number }) {
  const [active, setActive] = useState<ExperienceEntry | null>(null)

  return (
    <>
      <RevealOnScroll delay={delay} className="px-6 py-10 md:px-10 md:py-14">
        <p className="mb-7 text-[0.625rem] uppercase tracking-[0.22em] text-faint">
          Experience
        </p>

        <div className="flex flex-col">
          {experience.map((entry) => (
            <button
              key={entry.slug}
              type="button"
              onClick={() => setActive(entry)}
              aria-haspopup="dialog"
              className="group relative cursor-pointer py-3 text-left first:pt-0"
            >
              {/* Grows on hover rather than sliding sideways like the
                  non-interactive rows elsewhere in this block, so the two read
                  as different kinds of thing. Scaled from the left edge so the
                  row stays anchored to the column. */}
              <span className="block origin-left transition-transform duration-300 ease-[var(--ease-brand)] group-hover:scale-[1.035] motion-reduce:transition-none">
                <span className="flex items-baseline justify-between gap-4">
                  <span className="text-[0.9375rem] leading-snug text-ink">
                    {entry.company}
                  </span>
                  <span className="shrink-0 text-[0.8125rem] tabular-nums text-faint transition-colors duration-300 group-hover:text-muted">
                    {entry.period}
                  </span>
                </span>
                <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted transition-colors duration-300 group-hover:text-ink">
                  {entry.role}
                </span>
              </span>
              {/* Same underline wipe as the hero links. */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-rule transition-transform duration-300 ease-[var(--ease-brand)] group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none"
              />
            </button>
          ))}
        </div>
      </RevealOnScroll>

      <ExperienceDialog entry={active} onClose={() => setActive(null)} />
    </>
  )
}

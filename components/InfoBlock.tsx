import { awards, education, languages, skills, type InfoCell } from '@/data/info'
import RevealOnScroll from './RevealOnScroll'

function Cell({ cell, delay }: { cell: InfoCell; delay: number }) {
  return (
    <RevealOnScroll delay={delay} className="px-6 py-10 md:px-10 md:py-14">
      <p className="mb-7 text-[0.625rem] uppercase tracking-[0.22em] text-faint">
        {cell.label}
      </p>
      <div className="flex flex-col gap-5">
        {cell.rows.map((row) => (
          <div key={row.primary} className="group">
            <div className="flex items-baseline justify-between gap-6">
              <span className="text-[0.9375rem] leading-snug text-ink transition-transform duration-300 ease-[var(--ease-brand)] group-hover:translate-x-1 motion-reduce:transition-none">
                {row.primary}
              </span>
              {row.meta && (
                <span className="shrink-0 text-[0.8125rem] tabular-nums text-faint">
                  {row.meta}
                </span>
              )}
            </div>
            {row.secondary && (
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
                {row.secondary}
              </p>
            )}
          </div>
        ))}
      </div>
    </RevealOnScroll>
  )
}

export default function InfoBlock() {
  return (
    <section
      id="info"
      className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_clamp(140px,15vw,220px)_1fr]"
    >
      {/* Left column: two stacked cells split by a hairline. */}
      <div className="divide-y divide-rule">
        <Cell cell={education} delay={0} />
        <Cell cell={awards} delay={0.08} />
      </div>

      {/* Centre column: narrow viewport the persistent king is parked in. The
          king itself is a fixed-position element outside this tree — this is
          only the measurement anchor and the hairline rules that frame it. */}
      <div
        id="king-anchor-info"
        aria-hidden="true"
        className="min-h-[220px] border-y border-rule md:min-h-0 md:border-x md:border-y-0"
      />

      {/* Right column. */}
      <div className="divide-y divide-rule">
        <Cell cell={skills} delay={0.04} />
        <Cell cell={languages} delay={0.12} />
      </div>
    </section>
  )
}

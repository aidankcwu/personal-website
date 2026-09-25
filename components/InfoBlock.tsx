import { awards, education, skills, type InfoCell } from '@/data/info'
import ExperienceCell from './ExperienceCell'
import RevealOnScroll from './RevealOnScroll'

function Cell({ cell, delay }: { cell: InfoCell; delay: number }) {
  return (
    <RevealOnScroll delay={delay} className="px-6 py-10 md:px-10 md:py-14">
      <p className="mb-7 text-[0.625rem] uppercase tracking-[0.22em] text-faint">
        {cell.label}
      </p>
      {/* Flat list, but a row marked `sub` is an attribute of the row above it,
          so it indents and sets smaller. Spacing is per-row rather than a
          container gap: a sub-row has to sit closer to its parent than two
          top-level rows sit to each other, or the nesting reads as ambiguous. */}
      <div className="flex flex-col">
        {cell.rows.map((row) => (
          <div
            key={row.primary}
            className={`group first:mt-0 ${row.sub ? 'mt-3 pl-5' : 'mt-5'}`}
          >
            <div className="flex items-baseline justify-between gap-6">
              <span
                className={`leading-snug text-ink transition-transform duration-300 ease-[var(--ease-brand)] group-hover:translate-x-1 motion-reduce:transition-none ${
                  row.sub ? 'text-[0.8125rem]' : 'text-[0.9375rem]'
                }`}
              >
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
      className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_clamp(300px,30vw,520px)_1fr]"
    >
      {/* Left column: two stacked cells split by a hairline. */}
      <div className="divide-y divide-rule">
        <Cell cell={education} delay={0} />
        <Cell cell={awards} delay={0.08} />
      </div>

      {/* Centre column: the king's slot. The king itself is a full-viewport 3D
          layer outside this tree, but it tracks this column's centre until it
          pins, so this element is what gives it its place in the layout. */}
      <div
        id="king-slot"
        aria-hidden="true"
        className="min-h-[220px] border-y border-rule md:min-h-0 md:border-x md:border-y-0"
      />

      {/* Right column. Experience sits on top: reading order across the grid
          runs left-top, left-bottom, right-top, right-bottom, and it's the
          strongest material here. Skills is a reference list and reads fine
          last. */}
      <div className="divide-y divide-rule">
        <ExperienceCell delay={0.04} />
        <Cell cell={skills} delay={0.12} />
      </div>
    </section>
  )
}

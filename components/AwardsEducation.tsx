import RevealOnScroll from './RevealOnScroll'

const education = [
  {
    school: 'University Placeholder',
    degree: 'B.S. in [Major]',
    years: '2022 — 2026',
    notes: 'GPA: X.XX / 4.00. Relevant coursework: [Course A], [Course B], [Course C].',
  },
]

const awards = [
  {
    name: 'Award / Honor Placeholder',
    description: 'Brief description of what this award recognizes and how you earned it.',
    year: '2024',
  },
  {
    name: 'Scholarship or Competition Placeholder',
    description:
      'Brief description of the competition, your placement, and what you built or solved.',
    year: '2023',
  },
  {
    name: "Dean's List",
    description: 'Awarded for academic achievement in [semester/year].',
    year: '2023',
  },
]

export default function AwardsEducation() {
  return (
    <>
      {/* Education */}
      <section className="pl-6 md:pl-16 lg:pl-24 pr-6 pt-20 max-w-3xl">
        <RevealOnScroll>
          <h2 className="italic text-7xl md:text-8xl text-neutral-200/70 mb-2 leading-[0.9] tracking-tight">
            Education
          </h2>
          <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 mb-16">
            Where I learn
          </p>
        </RevealOnScroll>

        <div className="flex flex-col gap-10 pb-20">
          {education.map((entry, i) => (
            <RevealOnScroll key={entry.school} delay={0.08 + i * 0.08}>
              <div className="flex items-baseline justify-between gap-6 mb-2">
                <p className="italic text-2xl md:text-3xl text-neutral-100">{entry.school}</p>
                <span className="text-sm text-neutral-500 shrink-0">{entry.years}</span>
              </div>
              <p className="text-base text-neutral-400 mb-2">{entry.degree}</p>
              <p className="text-sm text-neutral-500 leading-relaxed">{entry.notes}</p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* End-to-end divider between Education and Awards. Fades to transparent
          before the king's visible area so the rule doesn't appear to cut
          through the model. */}
      <div
        aria-hidden="true"
        className="h-px relative z-10"
        style={{
          background:
            'linear-gradient(to right, rgb(38 38 38) 0%, rgb(38 38 38) 55%, transparent 68%)',
        }}
      />

      {/* Awards */}
      <section className="pl-6 md:pl-16 lg:pl-24 pr-6 pt-20 pb-32 max-w-3xl">
        <RevealOnScroll>
          <h2 className="italic text-7xl md:text-8xl text-neutral-200/70 mb-2 leading-[0.9] tracking-tight">
            Awards
          </h2>
          <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 mb-16">
            Recognition
          </p>
        </RevealOnScroll>

        <div className="flex flex-col">
          {awards.map((award, i) => (
            <RevealOnScroll key={award.name} delay={0.08 + i * 0.06}>
              <div
                className={`grid grid-cols-[60px_1fr] gap-x-8 py-6 ${
                  i > 0 ? 'border-t border-neutral-800/70' : ''
                }`}
              >
                <span className="text-sm italic text-neutral-500 pt-1">{award.year}</span>
                <div>
                  <p className="italic text-xl text-neutral-100 mb-1">{award.name}</p>
                  <p className="text-sm text-neutral-500 leading-relaxed">{award.description}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  )
}

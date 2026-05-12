const education = [
  {
    school: 'University Placeholder',
    degree: 'B.S. in [Major]',
    years: '2022 – 2026',
    notes: 'GPA: X.XX / 4.00 · Relevant coursework: [Course A], [Course B], [Course C]',
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
    description: 'Brief description of the competition, your placement, and what you built or solved.',
    year: '2023',
  },
  {
    name: 'Dean\'s List / Academic Honor',
    description: 'Awarded for academic achievement in [semester/year].',
    year: '2023',
  },
]

export default function AwardsEducation() {
  return (
    <section className="px-6 py-24 max-w-3xl mx-auto w-full">
      {/* Education */}
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-8">
        Education
      </h2>
      <div className="flex flex-col gap-4 mb-16">
        {education.map((entry) => (
          <div
            key={entry.school}
            className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/50"
          >
            <div className="flex items-start justify-between gap-4 mb-1">
              <p className="font-semibold text-neutral-100">{entry.school}</p>
              <span className="text-xs text-neutral-500 shrink-0">{entry.years}</span>
            </div>
            <p className="text-sm text-neutral-400 mb-2">{entry.degree}</p>
            <p className="text-xs text-neutral-500 leading-relaxed">{entry.notes}</p>
          </div>
        ))}
      </div>

      {/* Awards */}
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-8">
        Awards &amp; Honors
      </h2>
      <div className="flex flex-col gap-3">
        {awards.map((award) => (
          <div key={award.name} className="flex gap-4">
            <span className="text-xs text-neutral-600 shrink-0 pt-0.5 w-10">{award.year}</span>
            <div>
              <p className="text-sm font-medium text-neutral-200 mb-0.5">{award.name}</p>
              <p className="text-xs text-neutral-500 leading-relaxed">{award.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

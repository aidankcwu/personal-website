export type InfoRow = {
  primary: string
  secondary?: string
  meta?: string
}

export type InfoCell = {
  label: string
  rows: InfoRow[]
}

// Placeholder content — swap in the real details. Kept deliberately terse:
// this block is context, not a resume dump.
export const education: InfoCell = {
  label: 'Education',
  rows: [
    {
      primary: 'Northeastern University',
      secondary: 'B.S. in [Major]',
      meta: '2022 — 2026',
    },
  ],
}

export const awards: InfoCell = {
  label: 'Awards',
  rows: [
    { primary: '[Award or honor]', meta: '2024' },
    { primary: '[Competition placement]', meta: '2023' },
    { primary: "Dean's List", meta: '2023' },
  ],
}

export const skills: InfoCell = {
  label: 'Skills',
  rows: [
    { primary: 'Languages', secondary: 'TypeScript, Python, Java' },
    { primary: 'Frontend', secondary: 'React, Next.js, Tailwind' },
    { primary: 'Backend', secondary: 'Node, FastAPI, Postgres' },
  ],
}

export const languages: InfoCell = {
  label: 'Languages',
  rows: [
    { primary: 'English', meta: 'Native' },
    { primary: 'Mandarin', meta: 'Fluent' },
  ],
}

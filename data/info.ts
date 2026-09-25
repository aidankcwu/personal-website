export type InfoRow = {
  primary: string
  secondary?: string
  meta?: string
  /** Renders indented and lighter, as an attribute of the row above it. */
  sub?: boolean
}

export type InfoCell = {
  label: string
  rows: InfoRow[]
}

export const education: InfoCell = {
  label: 'Education',
  rows: [
    {
      primary: 'Rice University',
      secondary: 'B.S. Computer Science, B.S. Operations Research. Minor in Data Science.',
      meta: '4.00 GPA',
    },
    {
      primary: 'Coursework',
      secondary:
        'Optimization for AI, Optimization & Graph Theory, Discrete Math & Algorithms, Statistics for Data Science',
      sub: true,
    },
    {
      primary: 'Activities',
      secondary:
        'Rice Data Science, Rice Machine Learning, Rice INFORMS, Rice Quantitative Fund',
      sub: true,
    },
    {
      primary: 'Hong Kong International School',
    },
  ],
}

export const awards: InfoCell = {
  label: 'Awards',
  rows: [
    {
      primary: 'HackRice 16',
      secondary: '1st in Healthcare Track, 120+ teams',
      meta: '2026',
    },
    {
      primary: 'IMC Prosperity 4',
      secondary: 'Top 5% of 22,000+ teams',
      meta: '2026',
    },
    {
      primary: 'Claude Hackathon',
      secondary: '1st in Innovation Track',
      meta: '2026',
    },
    {
      primary: 'Hong Kong Scholarship for Excellence Scheme',
      secondary:
        'One of 50 undergraduates in Hong Kong selected for a government scholarship worth HKD 300,000 (USD 38.5k) per year',
      meta: '2025',
    },
  ],
}

export const skills: InfoCell = {
  label: 'Skills',
  rows: [
    { primary: 'Programming', secondary: 'Python, SQL, R, LaTeX' },
    { primary: 'Libraries', secondary: 'PyTorch, pandas, scikit-learn, LlamaIndex, FastAPI' },
    { primary: 'Tools', secondary: 'Postgres, pgvector, Docker, Git, Claude Code' },
    { primary: 'Spoken', secondary: 'English, Mandarin, Cantonese, Spanish' },
  ],
}

export type ExperienceEntry = {
  slug: string
  company: string
  role: string
  location?: string
  /** Trailing em dash means ongoing. */
  period: string
  detail: string[]
}

export const experience: ExperienceEntry[] = [
  {
    slug: 'optimalab',
    company: 'OptimaLab',
    role: 'Undergraduate Researcher',
    location: 'Rice University',
    period: 'Aug 2026 —',
    detail: [
      "Joining Prof. Anastasios Kyrillidis's group at Rice to research low-bit quantization effects on LLM reasoning behavior and token efficiency.",
    ],
  },
  {
    slug: 'linvest21',
    company: 'Linvest21',
    role: 'AI Software Engineering Intern',
    location: 'New York (Remote)',
    period: 'May — Aug 2026',
    detail: [
      'Designed the curated data layer serving 18 planned AI agents, with retrieval over Postgres + pgvector (hybrid vector/keyword search, parent-child chunking, HNSW); built an eval harness to measure tangible improvement from specific prompt and config changes.',
      'Built an idempotent, resumable ETL pipeline (Python, Postgres) pulling daily prices and sector data for 50+ tickers from a third-party API.',
      'Spearheaded design of a reusable LLM agent benchmarking tool and built its pre-flight verification stage, leading to a 25% accuracy lift.',
      "Reduced benchmark runtime from 1 hour to under 10 minutes by rewriting the runner's serial loop with bounded async concurrency.",
    ],
  },
  {
    slug: 'connexus-travel',
    company: 'Connexus Travel',
    role: 'Software Engineering Intern',
    location: 'Hong Kong',
    period: 'Jun — Aug 2026',
    detail: [
      'Building an LLM pipeline that polls a client inbox handling ~700 requests/week and drafts a reply directly into the inbox for human approval.',
      'Scoping supported request types and planning integration into existing workflows directly with non-technical staff.',
    ],
  },
  {
    slug: 'iqon-solutions',
    company: 'iQON Solutions',
    role: 'Software Engineering Intern',
    location: '',
    period: '',
    detail: [
      'Built a feature for a construction AI startup.',
    ],
  },
  {
    slug: 'yamagami-lab',
    company: 'Yamagami Lab',
    role: 'Undergraduate Researcher',
    location: 'Rice University',
    period: 'Jan 2026 —',
    detail: [
      'Researching meta-augmentation strategies for EMG and IMU time-series data in few-shot personalized gesture classification settings.',
      'Implementing time-series augmentations including Gaussian jittering, temporal and magnitude warping, and frequency-based decomposition.',
      'Integrating augmentation pipelines into established meta-learning training and evaluation workflows.',
    ],
  },
]

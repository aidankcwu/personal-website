export type Project = {
  slug: string;
  title: string;
  /** Card blurb. Two or three lines at most — the detail page carries the rest. */
  summary: string;
  /** Month and year, or a range for work that ran over a period. */
  date: string;
  stack: string[];
  link?: string;
  github?: string;
  featured: boolean;
  /** Long-form writeup, rendered on /projects/[slug]. */
  description: string;
};

const TODO = "";

export const projects: Project[] = [
  {
    slug: "bryan",
    title: "Bryan",
    summary:
      "Smart glasses software that tracks what ordinary wearables can't. It reads context through the camera and speaks health-conscious suggestions back through the speaker. Won the Healthcare Track at HackRice 16, out of 120+ teams.",
    date: "Sep 2026",
    stack: ["Swift", "Python", "Gemini Vision", "ElevenLabs"],
    featured: true,
    description: TODO,
  },
  {
    slug: "agent-fleet",
    title: "Self-Hosted Agent Fleet",
    summary:
      "A 24/7 multi-agent system that clears the recurring bottlenecks in my week — sorting news, following up with contacts, surfacing papers. A thin orchestrator spawns headless agents and gates anything irreversible behind approval. They share one git-backed knowledge base, so the system compounds as each agent writes back what it learns.",
    date: "Jun 2026 —",
    stack: ["Python", "Claude Code", "Git"],
    featured: true,
    description: TODO,
  },
  {
    slug: "agent-benchmarking",
    title: "LLM Agent Benchmarking Harness",
    summary:
      "A reusable harness for benchmarking LLM agents, built at Linvest21. A pre-flight verification stage catches malformed runs before they burn tokens, lifting measured accuracy by 25%. Rewriting the runner's serial loop with bounded async concurrency cut a one-hour benchmark to under ten minutes.",
    date: "May — Aug 2026",
    stack: ["Python", "asyncio"],
    featured: true,
    description: TODO,
  },
  {
    slug: "proposal-review",
    title: "Multi-Agent Proposal Review",
    summary:
      "A multi-agent system that reads a business proposal and surfaces the blind spots its authors missed. Built in five hours; won the Innovation Track at the Claude Hackathon.",
    date: "Apr 2026",
    stack: ["Claude API", "Python"],
    featured: true,
    description: TODO,
  },
  {
    slug: "goodnotes-to-obsidian",
    title: "GoodNotes to Obsidian",
    summary:
      "A pipeline that turns handwritten GoodNotes pages into a linked, searchable Obsidian vault. OCR handles the handwriting, LaTeX math, and diagrams; a two-stage RAG pass (embedding retrieval, then cross-encoder reranking) proposes the links and tags. Shipped as an open-source CLI.",
    date: "Feb — Apr 2026",
    stack: ["Python", "LlamaIndex", "FastAPI", "GPT-4o-mini"],
    featured: true,
    description: TODO,
  },
  {
    slug: "iqon-solutions",
    title: "iQON Solutions",
    summary: TODO,
    date: TODO,
    stack: [],
    featured: true,
    description: TODO,
  },
  {
    slug: "imc-prosperity-4",
    title: "IMC Prosperity 4",
    summary:
      "A writeup of the strategies my team ran in IMC's 16-day algorithmic trading challenge, where we finished in the top 5% of more than 22,000 teams.",
    date: "May 2026",
    stack: [],
    featured: true,
    description: TODO,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);

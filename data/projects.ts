export type Project = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  link?: string;
  github?: string;
  featured: boolean;
  description: string;
};

export const projects: Project[] = [
  {
    slug: "project-alpha",
    title: "Project Alpha",
    summary: "A placeholder project that does something interesting with data and machine learning.",
    stack: ["Python", "FastAPI", "PostgreSQL"],
    github: "https://github.com",
    featured: true,
    description:
      "Longer writeup about Project Alpha goes here. Describe the problem, your approach, what you learned, and the outcome.",
  },
  {
    slug: "project-beta",
    title: "Project Beta",
    summary: "A web app that solves a real problem for a specific type of user.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "https://example.com",
    github: "https://github.com",
    featured: true,
    description:
      "Longer writeup about Project Beta goes here. Describe the problem, your approach, what you learned, and the outcome.",
  },
  {
    slug: "project-gamma",
    title: "Project Gamma",
    summary: "An experiment in building something at the intersection of two fields.",
    stack: ["Rust", "WebAssembly"],
    github: "https://github.com",
    featured: true,
    description:
      "Longer writeup about Project Gamma goes here. Describe the problem, your approach, what you learned, and the outcome.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectBySlug, projects } from '@/data/projects'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  return { title: project ? `${project.title} — Aidan Wu` : 'Not Found' }
}

const linkClass =
  "relative inline-flex text-sm text-muted transition-colors duration-300 before:absolute before:left-0 before:top-[1.45em] before:h-px before:w-full before:origin-right before:scale-x-0 before:bg-current before:transition-transform before:duration-300 before:ease-[var(--ease-brand)] before:content-[''] hover:text-ink hover:before:origin-left hover:before:scale-x-100"

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <main className="mx-auto max-w-[46rem] px-6 py-32 md:px-16">
      <Link
        href="/"
        className="mb-24 inline-flex text-[0.6875rem] uppercase tracking-[0.2em] text-faint transition-colors duration-300 hover:text-ink"
      >
        Back
      </Link>

      <h1 className="mb-8 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-ink">
        {project.title}
      </h1>

      <p className="mb-16 text-[0.6875rem] uppercase tracking-[0.2em] text-faint">
        {project.stack.join(' · ')}
      </p>

      <p className="mb-8 text-[1.0625rem] leading-[1.75] text-ink">{project.summary}</p>

      <div className="whitespace-pre-line text-[0.975rem] leading-[1.75] text-muted">
        {project.description}
      </div>

      {(project.github || project.link) && (
        <div className="mt-20 flex items-center gap-8 border-t border-rule pt-10">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
              GitHub
            </a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Live site
            </a>
          )}
        </div>
      )}
    </main>
  )
}

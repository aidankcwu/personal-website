import Link from 'next/link'
import type { Project } from '@/data/projects'

// Flat by rule: no fill, no radius, no elevation. Hierarchy is type scale,
// whitespace, and a single hairline.
export default function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block w-full max-w-[46rem]"
    >
      <div className="mb-8 flex items-center gap-6">
        <span className="text-[0.6875rem] tabular-nums tracking-[0.2em] text-faint">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="h-px flex-1 bg-rule" />
      </div>

      <h3 className="mb-6 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-ink">
        {project.title}
      </h3>

      <p className="mb-6 max-w-[36rem] text-[0.975rem] leading-[1.75] text-muted">
        {project.summary}
      </p>

      <p className="mb-8 text-[0.6875rem] uppercase tracking-[0.2em] text-faint">
        {project.stack.join(' · ')}
      </p>

      <span className="relative inline-flex text-sm text-muted transition-colors duration-300 before:absolute before:left-0 before:top-[1.45em] before:h-px before:w-full before:origin-right before:scale-x-0 before:bg-current before:transition-transform before:duration-300 before:ease-[var(--ease-brand)] before:content-[''] group-hover:text-ink group-hover:before:origin-left group-hover:before:scale-x-100 motion-reduce:before:transition-none">
        Read more
      </span>
    </Link>
  )
}

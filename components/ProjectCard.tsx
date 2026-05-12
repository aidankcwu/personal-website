import Link from 'next/link'
import type { Project } from '@/data/projects'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col gap-3 p-5 rounded-xl border border-neutral-800 hover:border-neutral-600 transition-colors bg-neutral-900/50"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-neutral-100 group-hover:text-white transition-colors">
          {project.title}
        </h3>
        <span className="text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors shrink-0">
          Read more →
        </span>
      </div>
      <p className="text-sm text-neutral-400 leading-relaxed">{project.summary}</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {project.stack.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

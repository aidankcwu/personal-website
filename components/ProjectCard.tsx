import Link from 'next/link'
import type { Project } from '@/data/projects'

function stackPhrase(stack: string[]): string {
  if (stack.length === 0) return ''
  if (stack.length === 1) return stack[0]
  if (stack.length === 2) return `${stack[0]} and ${stack[1]}`
  return `${stack.slice(0, -1).join(', ')}, and ${stack[stack.length - 1]}`
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <h3 className="italic text-3xl md:text-4xl text-neutral-100 group-hover:text-purple-200 transition-colors leading-tight mb-4">
        {project.title}
      </h3>
      <p className="text-base text-neutral-400 leading-relaxed mb-3">
        {project.summary}
      </p>
      <p className="text-sm italic text-neutral-500 mb-5">
        Built with {stackPhrase(project.stack)}.
      </p>
      <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 group-hover:text-purple-300 transition-colors">
        Read more →
      </span>
    </Link>
  )
}

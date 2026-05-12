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

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <main className="max-w-2xl mx-auto px-6 py-24">
      <Link
        href="/"
        className="inline-block text-sm text-neutral-500 hover:text-neutral-300 transition-colors mb-10"
      >
        ← Back
      </Link>

      <p className="text-xs text-neutral-600 uppercase tracking-widest mb-3">Case Study</p>
      <h1 className="text-4xl font-bold tracking-tight text-neutral-100 mb-4">
        {project.title}
      </h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.stack.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="prose prose-invert prose-neutral max-w-none">
        <p className="text-neutral-300 leading-relaxed text-lg">{project.summary}</p>
        <div className="mt-6 text-neutral-400 leading-relaxed whitespace-pre-line">
          {project.description}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-12 pt-8 border-t border-neutral-800">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md border border-neutral-700 text-neutral-300 text-sm hover:border-neutral-500 hover:text-neutral-100 transition-colors"
          >
            GitHub ↗
          </a>
        )}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md bg-neutral-100 text-neutral-900 font-medium text-sm hover:bg-white transition-colors"
          >
            Live site ↗
          </a>
        )}
      </div>
    </main>
  )
}

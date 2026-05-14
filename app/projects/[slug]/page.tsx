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

function stackPhrase(stack: string[]): string {
  if (stack.length === 0) return ''
  if (stack.length === 1) return stack[0]
  if (stack.length === 2) return `${stack[0]} and ${stack[1]}`
  return `${stack.slice(0, -1).join(', ')}, and ${stack[stack.length - 1]}`
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <main className="max-w-2xl mx-auto px-6 md:px-12 py-32">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-neutral-500 hover:text-neutral-200 transition-colors mb-20"
      >
        <span className="text-neutral-700 text-base leading-none not-uppercase">♔</span>
        Back
      </Link>

      <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 mb-4">
        Case study
      </p>

      <h1 className="italic text-5xl md:text-6xl tracking-tight text-neutral-100 leading-[0.95] mb-8">
        {project.title}
        <span className="text-purple-400 not-italic">.</span>
      </h1>

      <p className="text-sm italic text-neutral-500 mb-12">
        Built with {stackPhrase(project.stack)}.
      </p>

      <div className="prose prose-invert max-w-none">
        <p className="text-xl text-neutral-300 leading-relaxed mb-8 first-letter:text-5xl first-letter:italic first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-purple-300/80">
          {project.summary}
        </p>
        <div className="mt-8 text-neutral-400 leading-relaxed whitespace-pre-line text-base">
          {project.description}
        </div>
      </div>

      <div className="flex items-center gap-6 mt-20 pt-10 border-t border-neutral-800">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm italic text-neutral-300 hover:text-purple-300 transition-colors underline-offset-4 hover:underline"
          >
            GitHub ↗
          </a>
        )}
        {project.link && (
          <>
            {project.github && <span className="text-neutral-700">—</span>}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm italic text-neutral-300 hover:text-purple-300 transition-colors underline-offset-4 hover:underline"
            >
              Live site ↗
            </a>
          </>
        )}
      </div>
    </main>
  )
}

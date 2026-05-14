import { featuredProjects } from '@/data/projects'
import ProjectCard from './ProjectCard'

export default function FeaturedProjects() {
  return (
    <section id="projects" className="pl-6 md:pl-16 lg:pl-24 pr-6 py-32 max-w-2xl">
      <h2 className="italic text-7xl md:text-8xl text-neutral-200/70 mb-2 leading-[0.9] tracking-tight">
        Projects
      </h2>
      <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 mb-20">
        Selected work
      </p>

      <div className="flex flex-col">
        {featuredProjects.map((project, i) => (
          <div key={project.slug}>
            {i > 0 && (
              <div className="my-14 flex items-center gap-5">
                <span className="text-neutral-700 text-sm leading-none">♔</span>
                <div className="flex-1 h-px bg-neutral-800/80" />
              </div>
            )}
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  )
}

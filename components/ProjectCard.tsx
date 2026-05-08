import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col gap-3 p-5 rounded-xl border border-neutral-800 hover:border-neutral-600 transition-colors bg-neutral-900/50">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-neutral-100 group-hover:text-white transition-colors">
          {project.title}
        </h3>
        <div className="flex items-center gap-3 shrink-0">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              GitHub ↗
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Live ↗
            </a>
          )}
        </div>
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
    </div>
  );
}

import { featuredProjects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function FeaturedProjects() {
  return (
    <section id="projects" className="px-6 py-24 max-w-3xl mx-auto w-full">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-8">
        Projects
      </h2>
      <div className="flex flex-col gap-4">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

import { projects } from "../data/projects";
import { Card } from "./ui/Card";

function ProjectDetails({ project }) {
  return <>
    <p className="my-3 text-sm leading-relaxed text-secondary">{project.description}</p>
    <ul className="mb-3 flex flex-wrap gap-1" aria-label="Technologies">
      {project.tags.map(tag => <li className="rounded border border-slate-700 px-2 text-xs" key={tag.name}>{tag.name}</li>)}
    </ul>
  </>;
}

export default function Works() {
  return <section id="projects" className="portfolio-wrap scroll-mt-20 py-16" aria-labelledby="projects-title">
    <h2 id="projects-title" className="text-4xl font-semibold tracking-tight">Featured projects</h2>
    <div className="mt-8 grid items-start sm:items-stretch sm:auto-rows-fr grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      {projects.map(project => <Card key={project.name} className="project-card flex min-w-0 flex-col">
        <details className="project-disclosure">
          <summary aria-label={project.name + " details"}>
            <img src={project.image} alt="" loading="lazy" className="project-poster" />
            <span className="project-name">{project.name}</span>
          </summary>
          <ProjectDetails project={project} />
        </details>
        <div className="hidden sm:block">
          <img src={project.image} alt={project.name + " poster"} loading="lazy" className="project-poster" />
          <h3 className="project-name">{project.name}</h3>
          <ProjectDetails project={project} />
        </div>
        <div className="project-actions">
          <a href={project.live_link} aria-label={project.name + " live demo"}>Live demo</a>
          {project.source_code_link && <a href={project.source_code_link} aria-label={project.name + " source on GitHub"}>Source code</a>}
        </div>
      </Card>)}
    </div>
  </section>;
}

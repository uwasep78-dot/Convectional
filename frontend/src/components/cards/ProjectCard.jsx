import { Link } from 'react-router-dom'
import { Button } from '../common/Button.jsx'

export function ProjectCard({ project, className = '' }) {
  return (
    <article className={`project-card ${className}`}>
      <div className="project-card-image">
        <img src={project.image} alt={project.title} loading="lazy" />
        <span className="project-card-badge">{project.category}</span>
      </div>
      <div className="project-card-content">
        <span className="project-card-category text-muted text-xs">{project.category}</span>
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-description text-muted text-sm">{project.description}</p>
        <Link to={`/projects/${project.slug}`} className="project-card-link">
          View Project <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}

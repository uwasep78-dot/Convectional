import { Link } from 'react-router-dom'
import { Button } from '../common/Button.jsx'

export function CourseCard({ course, className = '' }) {
  return (
    <article className={`course-card ${className}`}>
      <div className="course-card-image">
        <img src={course.image} alt={course.title} loading="lazy" />
      </div>
      <div className="course-card-content">
        <span className="course-card-category text-muted text-xs">{course.category}</span>
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-description text-muted text-sm">{course.description}</p>
        <div className="course-card-meta">
          <span>{course.duration}</span>
          {course.prerequisites && <span>· {course.prerequisites}</span>}
        </div>
        <Link to={`/training/courses/${course.slug}`} className="course-card-link">
          View Course <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}

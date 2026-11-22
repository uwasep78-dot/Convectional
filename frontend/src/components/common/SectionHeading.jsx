export function SectionHeading({ heading, eyebrow, description, className = '', center = false }) {
  return (
    <div className={`section-heading ${center ? 'text-center' : ''} ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {heading && <h2 className="heading">{heading}</h2>}
      {description && <p className="description text-muted">{description}</p>}
    </div>
  )
}

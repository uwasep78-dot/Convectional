export function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div className={`empty-state ${className}`} role="status" aria-label={title}>
      {icon && <span className="empty-icon" aria-hidden="true">{icon}</span>}
      <h3 className="empty-title">{title}</h3>
      {description && <p className="empty-description text-muted">{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  )
}

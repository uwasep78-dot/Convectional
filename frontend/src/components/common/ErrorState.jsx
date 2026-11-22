export function ErrorState({ title = 'Something went wrong', description, onRetry, retryLabel = 'Try again', className = '' }) {
  return (
    <div className={`error-state ${className}`} role="alert" aria-label={title}>
      <h3>{title}</h3>
      {description && <p className="text-muted">{description}</p>}
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

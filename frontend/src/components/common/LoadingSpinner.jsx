export function LoadingSpinner({ size = 24, className = '', ariaLabel = 'Loading' }) {
  return (
    <div
      className={`loading-spinner ${className}`}
      role="status"
      aria-label={ariaLabel}
      style={{ width: size, height: size }}
    >
      <svg className="spinner-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="spinner-circle" />
      </svg>
    </div>
  )
}

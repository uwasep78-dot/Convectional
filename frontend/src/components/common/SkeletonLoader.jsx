export function SkeletonLoader({ className = '', width = '100%', height = 16 }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

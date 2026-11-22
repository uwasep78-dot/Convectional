export function Pagination({ page, totalPages, onChange, className = '' }) {
  if (totalPages <= 1) return null
  const maxSiblings = 1
  const range = []
  const push = (val) => range.push(val)
  const left = Math.max(1, page - maxSiblings)
  const right = Math.min(totalPages, page + maxSiblings)
  if (left > 2) push(1), push('...')
  for (let i = left; i <= right; i++) push(i)
  if (right < totalPages - 1) push('...'), push(totalPages)
  return (
    <nav className={`pagination ${className}`} aria-label="Pagination">
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        ← Prev
      </Button>
      {range.map((item) => (
        item === '...' ? (
          <span key="dots" className="pagination-dots" aria-hidden="true">…</span>
        ) : (
          <button
            key={item}
            type="button"
            className={`page-btn ${page === item ? 'active' : ''}`}
            onClick={() => onChange(item)}
            aria-label={`Page ${item}`}
            aria-current={page === item ? 'true' : undefined}
          >
            {item}
          </button>
        )
      ))}
      <Button
        variant="outline"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        Next →
      </Button>
    </nav>
  )
}

export function CategoryFilter({ categories, active, onChange, className = '' }) {
  return (
    <div className={`category-filter ${className}`} role="group" aria-label="Filter by category">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`filter-chip ${active === cat ? 'active' : ''}`}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

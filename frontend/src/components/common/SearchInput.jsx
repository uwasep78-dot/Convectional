import { useState } from 'react'

export function SearchInput({ placeholder = 'Search', value = '', onChange, className = '' }) {
  const [focused, setFocused] = useState(false)
  return (
    <div className={`search-input ${className}`} role="search">
      <input
        type="search"
        className="search-input-field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={placeholder}
        autoComplete="off"
      />
      <span className="search-input-underline" aria-hidden="true" />
    </div>
  )
}

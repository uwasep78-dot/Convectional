import { useState } from 'react'
import { t, LANGUAGES } from '../config/languages.js'

export function LanguageSelector({ currentLang = 'en', onChange, className = '' }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`language-selector ${className}`} position="relative">
      <button
        type="button"
        className="language-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Select language"
      >
        {currentLang.toUpperCase()} <span className="chevron">▾</span>
      </button>
      {open && (
        <div className="language-menu" role="menu">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="menuitem"
              className={`language-item ${lang.code === currentLang ? 'active' : ''}`}
              onClick={() => { onChange(lang.code); setOpen(false) }}
            >
              {lang.native} ({lang.label})
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

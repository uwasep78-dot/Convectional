import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { NAVIGATION } from '../../config/navigation.js'

export function MobileNavigation({ isOpen, onToggle }) {
  return (
    <div
      className={`mobile-nav ${isOpen ? 'open' : ''}`}
      role="navigation"
      aria-label="Mobile navigation"
      hidden={!isOpen}
    >
      <div className="mobile-nav-overlay" onClick={onToggle} aria-hidden="true" />
      <div className="mobile-nav-panel">
        <div className="mobile-nav-header">
          <button type="button" className="mobile-nav-close" onClick={onToggle} aria-label="Close menu">
            <X size={22} strokeWidth={2} />
          </button>
        </div>
        <ul className="mobile-nav-list">
          {NAVIGATION.map((item) => {
            if (item.isCta) return null
            return (
              <li key={item.key} className="mobile-nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  end={item.path === '/'}
                  onClick={onToggle}
                >
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
        <div className="mobile-nav-cta">
          <a href="/quotation" className="mobile-nav-cta-link" onClick={onToggle}>
            Request a Quotation
          </a>
        </div>
      </div>
    </div>
  )
}

export function MenuToggle({ isOpen, onToggle }) {
  return (
    <button
      type="button"
      className="menu-toggle"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-label="Toggle navigation menu"
    >
      {isOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
      <span className="visually-hidden">{isOpen ? 'Close menu' : 'Open menu'}</span>
    </button>
  )
}

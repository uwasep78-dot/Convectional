import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { DropdownMenu, DropdownItem } from './DropdownMenu.jsx'
import { NAVIGATION } from '../../config/navigation.js'

export function DesktopNavigation() {
  return (
    <nav className="desktop-nav" aria-label="Main navigation">
      <div className="desktop-nav-inner">
        <div className="desktop-nav-items">
          {NAVIGATION.map((item) => {
            if (item.isCta) return null
            if (item.hasDropdown && item.items) {
              return (
                <DropdownMenu key={item.key} label={item.label} className="nav-dropdown">
                  {item.items.map((sub) => (
                    <DropdownItem key={sub.key} href={sub.path}>
                      {sub.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )
            }
            return (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            )
          })}
        </div>
        <a href="/quotation" className="nav-cta">Request a Quotation</a>
      </div>
    </nav>
  )
}

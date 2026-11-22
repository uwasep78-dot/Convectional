import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TopInfoBar } from './TopInfoBar.jsx'
import { DesktopNavigation } from './DesktopNavigation.jsx'
import { MobileNavigation, MenuToggle } from './MobileNavigation.jsx'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <header className="header">
      <TopInfoBar />
      <div className="header-main">
        <div className="container header-inner">
          <Link to="/" className="header-logo" aria-label="CONVENTIONAL COMPLEX & DUTIES AND RENEWABLE SYSTEM LTD. homepage">
            <img src="/assets/company-logo.png" alt="" className="header-logo-img" />
            <span className="header-logo-text">CONVENTIONAL COMPLEX & DUTIES AND RENEWABLE SYSTEM LTD.</span>
          </Link>
          <DesktopNavigation />
          <MenuToggle isOpen={mobileOpen} onToggle={() => setMobileOpen(!mobileOpen)} />
        </div>
      </div>
      <MobileNavigation isOpen={mobileOpen} onToggle={() => setMobileOpen(false)} />
    </header>
  )
}

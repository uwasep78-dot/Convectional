export function DropdownMenu({ label, children, className = '' }) {
  const [open, setOpen] = useState(false)
  const toggle = (e) => { e.preventDefault(); setOpen(!open) }
  return (
    <div className={`dropdown ${className}`} role="presentation">
      <button
        type="button"
        className="dropdown-trigger"
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(e) }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
      </button>
      <div
        className={`dropdown-menu ${open ? 'open' : ''}`}
        role="menu"
        hidden={!open}
      >
        {children}
      </div>
    </div>
  )
}

export function DropdownItem({ href, onClick, children, className = '' }) {
  return (
    <a href={href} onClick={onClick} className={`dropdown-item ${className}`} role="menuitem">
      {children}
    </a>
  )
}

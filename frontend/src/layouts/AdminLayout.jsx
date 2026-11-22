import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LayoutDashboard, Settings, LogOut, ChevronRight } from 'lucide-react'
import { Menu, X } from 'lucide-react'

const ADMIN_NAV = [
  { key: 'dashboard', label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { key: 'services', label: 'Services', path: '/admin/services' },
  { key: 'products', label: 'Products', path: '/admin/products' },
  { key: 'categories', label: 'Categories', path: '/admin/categories' },
  { key: 'projects', label: 'Projects', path: '/admin/projects' },
  { key: 'gallery', label: 'Gallery', path: '/admin/gallery' },
  { key: 'quotations', label: 'Quotations', path: '/admin/quotations' },
  { key: 'maintenance', label: 'Maintenance Requests', path: '/admin/maintenance' },
  { key: 'courses', label: 'Courses', path: '/admin/courses' },
  { key: 'registrations', label: 'Registrations', path: '/admin/registrations' },
  { key: 'enquiries', label: 'Customer Enquiries', path: '/admin/enquiries' },
  { key: 'customers', label: 'Customers', path: '/admin/customers' },
  { key: 'equipment', label: 'Equipment Records', path: '/admin/equipment' },
  { key: 'notifications', label: 'Notifications', path: '/admin/notifications' },
  { key: 'reports', label: 'Reports', path: '/admin/reports' },
  { key: 'settings', label: 'Website Settings', path: '/admin/settings', icon: Settings },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  return (
    <div className="admin-layout">
      <button
        type="button"
        className="admin-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-expanded={sidebarOpen}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} strokeWidth={2} />
      </button>
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <span className="admin-brand">CCR Admin</span>
          <button type="button" className="admin-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
            return (
              <a key={item.key} href={item.path} className={`admin-nav-link ${active ? 'active' : ''}`}>
                {Icon && <Icon size={18} strokeWidth={2} className="nav-icon" aria-hidden="true" />}
                <span className="nav-label">{item.label}</span>
                {active && <ChevronRight size={14} strokeWidth={2} className="nav-active" aria-hidden="true" />}
              </a>
            )
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="#" className="admin-nav-link">
            <LogOut size={18} strokeWidth={2} className="nav-icon" aria-hidden="true" />
            <span className="nav-label">Logout</span>
          </a>
        </div>
      </aside>
      <div className="admin-overlay" onClick={() => setSidebarOpen(false)} hidden={!sidebarOpen} />
      <div className="admin-content">
        <header className="admin-header">
          <div className="admin-header-inner">
            <div className="admin-header-actions">
              <span className="demo-badge">Admin demo mode</span>
            </div>
          </div>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

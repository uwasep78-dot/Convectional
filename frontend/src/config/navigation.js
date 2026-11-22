// Navigation configuration - editable menu structure
export const NAVIGATION = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'about', label: 'About Us', path: '/about' },
  {
    key: 'services',
    label: 'Services',
    path: '/services',
    hasDropdown: true,
    items: [
      { key: 'services-overview', label: 'All Services', path: '/services' },
      { key: 'maintenance', label: 'Technical Maintenance', path: '/services/technical-maintenance' },
      { key: 'training', label: 'Technical Training', path: '/services/technical-training' },
      { key: 'supplies', label: 'Tools & Materials Supply', path: '/services/tools-materials-supply' },
      { key: 'renewable', label: 'Renewable Energy Systems', path: '/services/renewable-energy-systems' },
    ],
  },
  { key: 'projects', label: 'Projects', path: '/projects' },
  { key: 'products', label: 'Products & Supplies', path: '/products' },
  { key: 'training-page', label: 'Technical Training', path: '/training' },
  { key: 'contact', label: 'Contact', path: '/contact' },
  { key: 'quotation', label: 'Request a Quotation', path: '/quotation', isCta: true },
]

export const FOOTER_QUICK_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Projects', path: '/projects' },
  { label: 'Products & Supplies', path: '/products' },
  { label: 'Technical Training', path: '/training' },
  { label: 'Contact', path: '/contact' },
  { label: 'Request a Quotation', path: '/quotation' },
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Use', path: '/terms-of-use' },
]

export const FOOTER_SERVICE_LINKS = [
  { label: 'Technical Maintenance', path: '/services/technical-maintenance' },
  { label: 'Technical Training', path: '/services/technical-training' },
  { label: 'Tools & Materials Supply', path: '/services/tools-materials-supply' },
  { label: 'Renewable Energy Systems', path: '/services/renewable-energy-systems' },
]

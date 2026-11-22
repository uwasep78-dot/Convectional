import { MapPin, Mail, Phone, Share2, Menu } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.js'

const ICONS = { location: MapPin, email: Mail, phone: Phone }

export function TopInfoBar() {
  const { lang, t } = useLanguage()
  return (
    <div className="topbar">
      <div className="topbar-left hide-mobile">
        <div className="topbar-item"><MapPin size={14} strokeWidth={1.5} className="topbar-icon" aria-hidden="true" /> <span>{t('topBar.location', lang)}</span></div>
        <div className="topbar-item"><Mail size={14} strokeWidth={1.5} className="topbar-icon" aria-hidden="true" /> <a href={`mailto:${''}`} className="topbar-link">{t('topBar.email', lang)}</a></div>
        <div className="topbar-item"><Phone size={14} strokeWidth={1.5} className="topbar-icon" aria-hidden="true" /> <a href={`tel:${''}`} className="topbar-link">{t('topBar.phone', lang)}</a></div>
      </div>
      <div className="topbar-right">
        <div className="topbar-social" aria-label="Social media">
          <a href="#" aria-label="Facebook"><Share2 size={16} strokeWidth={1.5} /></a>
          <a href="#" aria-label="LinkedIn"><Share2 size={16} strokeWidth={1.5} /></a>
        </div>
        <button type="button" className="topbar-language" aria-label="Language selector">
          {lang.toUpperCase()}
        </button>
      </div>
    </div>
  )
}

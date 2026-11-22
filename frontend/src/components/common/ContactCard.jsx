import { Phone, Mail, MapPin, Clock } from 'lucide-react'

const ICONS = { phone: Phone, email: Mail, location: MapPin, hours: Clock }

export function ContactCard({ icon = 'location', title, children, className = '' }) {
  const Icon = ICONS[icon]
  return (
    <div className={`contact-card ${className}`}>
      {Icon && <div className="contact-card-icon"><Icon size={20} strokeWidth={2} /></div>}
      <div className="contact-card-content">
        {title && <h4 className="contact-card-title">{title}</h4>}
        {children}
      </div>
    </div>
  )
}

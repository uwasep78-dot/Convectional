import { Wrench, GraduationCap, Package, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../common/Button.jsx'

const ICONS = { maintenance: Wrench, training: GraduationCap, supplies: Package, renewable: Sun }

export function ServiceCard({ key: serviceKey, title, description, icon, href, className = '' }) {
  const Icon = ICONS[serviceKey]
  return (
    <article className={`service-card ${className}`}>
      {Icon && <div className="service-card-icon"><Icon size={24} strokeWidth={2} /></div>}
      <h3 className="service-card-title">{title}</h3>
      <p className="service-card-description text-muted">{description}</p>
      {href && (
        <Link to={href} className="service-card-link">
          Learn more <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  )
}

export function ProductCard({ product, onAddToQuote }) {
  return (
    <article className={`product-card ${product.stock === false ? 'out-of-stock' : ''}`}>
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.stock === false && <span className="stock-badge unavailable">Unavailable</span>}
        {product.stock === true && <span className="stock-badge available">Available</span>}
      </div>
      <div className="product-card-content">
        <span className="product-card-category text-muted text-xs">{product.category}</span>
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-description text-muted text-sm">{product.description}</p>
        <div className="product-card-actions">
          <Button variant="outline">View Details</Button>
          {onAddToQuote && (
            <Button variant="outline" onClick={() => onAddToQuote(product)} disabled={product.stock === false}>
              Add to Quote
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

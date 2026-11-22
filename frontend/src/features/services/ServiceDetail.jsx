import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage.js'
import { SectionHeading } from '../../components/common/SectionHeading.jsx'
import { Breadcrumbs } from '../../components/common/SectionHeading.jsx'
import { PlaceholderImg } from '../../components/common/PlaceholderImg.jsx'
import { Button } from '../../components/common/Button.jsx'
import { SERVICES_CONFIG } from '../../config/services.js'

export default function ServiceDetail() {
  const { serviceKey } = useParams()
  const { t, lang } = useLanguage()
  const config = SERVICES_CONFIG[serviceKey]
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: config ? config.title : 'Service', href: '' },
  ]

  if (!config) {
    return (
      <div className="page">
        <section className="section">
          <div className="container">
            <Breadcrumbs items={breadcrumbs} />
            <h1>Service Not Found</h1>
            <p>The requested service could not be found.</p>
            <Link to="/services">Back to Services</Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page service-detail-page">
      <section className="service-hero">
        <div className="container">
          <Breadcrumbs items={breadcrumbs} />
          <PlaceholderImg
            label={`Service hero - ${config.title} (replace with company photo)`}
            className="service-hero-img"
          />
          <div className="service-hero-text">
            <span className="eyebrow">SERVICE DETAIL</span>
            <h1>{config.title}</h1>
            <p className="text-muted">{config.overview}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container service-detail-inner">
          <div className="service-overview">
            <h2>Overview</h2>
            <p>{config.overview}</p>
          </div>
          <div className="service-sections">
            <div className="service-section">
              <h2>Potential Applications</h2>
              <ul className="check-list">
                {config.applications.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="service-section">
              <h2>Benefits</h2>
              <ul className="check-list">
                {config.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="service-section service-details-list">
              <h2>Service Areas</h2>
              {config.sections.map((s) => (
                <div key={s.title} className="detail-item">
                  <h4>{s.title}</h4>
                  <p className="text-muted">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
          {config.faqs && config.faqs.length > 0 && (
            <div className="service-section faq-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {config.faqs.map((faq) => (
                  <div key={faq.q} className="faq-item">
                    <h4>{faq.q}</h4>
                    <p>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="service-actions">
            <Link to="/quotation" className="btn">
              Request a Quotation
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

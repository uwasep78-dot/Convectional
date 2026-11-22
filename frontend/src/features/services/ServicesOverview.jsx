import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage.js'
import { SectionHeading } from '../../components/common/SectionHeading.jsx'
import { ServiceCard } from '../../components/cards/ServiceCard.jsx'
import { DEMO_SERVICES } from '../../data/mockServices.js'

export default function ServicesOverview() {
  const { t, lang } = useLanguage()
  return (
    <div className="page services-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">OUR SERVICES</span>
          <h1>{t('pages.services.heading', lang)}</h1>
          <p className="text-muted">{t('services.description', lang)}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="CORE SERVICES"
            heading={t('services.heading', lang)}
            description={t('services.description', lang)}
          />
          <div className="services-grid">
            {DEMO_SERVICES.map((svc) => (
              <ServiceCard
                key={svc.key}
                serviceKey={svc.key}
                title={svc.title}
                description={svc.description}
                href={`/services/${svc.key}`}
              />
            ))}
          </div>
          <div className="services-note">
            <p>Service detail pages describe potential applications, benefits, and frequently asked questions. Content is configurable and subject to company confirmation.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

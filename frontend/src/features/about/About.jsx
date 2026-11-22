import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage.js'
import { SectionHeading } from '../../components/common/SectionHeading.jsx'
import { Breadcrumbs } from '../../components/common/Breadcrumbs.jsx'
import { PlaceholderImg } from '../../components/common/PlaceholderImg.jsx'
import { Button } from '../../components/common/Button.jsx'
import { ContactCard } from '../../components/common/ContactCard.jsx'
import { COMPANY } from '../../config/company.js'

export default function About() {
  const { t, lang } = useLanguage()
  return (
    <div className="page about-page">
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
          <span className="eyebrow">{t('about.eyebrow', lang)}</span>
          <h1>{t('pages.about.heading', lang)}</h1>
          <p className="text-muted">{t('about.intro', lang)}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow={t('about.eyebrow', lang)}
            heading={t('about.heading', lang)}
            description={t('about.intro', lang)}
          />
          <div className="about-columns">
            <div className="about-text">
              <h3>Our Mission</h3>
              <p>{t('about.mission', lang)}</p>
              <h3>Our Vision</h3>
              <p>{t('about.vision', lang)}</p>
            </div>
            <div className="about-image">
              <PlaceholderImg label="About - engineering team (replace with company photo)" className="about-img" />
              <p className="caption">Sample imagery - replace with company photograph</p>
            </div>
          </div>
          <div className="values-section">
            <h3>Our Values</h3>
            <div className="values-grid">
              {t('about.values', lang).map((v, i) => (
                <div key={i} className="value-card">
                  <span className="value-number">{i + 1}</span>
                  <h4>{v.title}</h4>
                  <p className="text-muted">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="commitments">
            <h3>Quality and Safety Commitments</h3>
            <p>We deliver technical services with a focus on reliability, safety, and professional standards. Specific commitments are defined per service engagement.</p>
            <h3>Environmental Responsibility</h3>
            <p>Through our Renewable Energy Systems area, we support sustainable energy solutions that reduce environmental impact.</p>
          </div>
          <div className="about-cta">
            <Link to="/contact" className="btn btn-secondary">
              Contact Our Team
            </Link>
            <Link to="/quotation" className="btn">
              Request a Quotation
            </Link>
          </div>
        </div>
      </section>

      <section className="section-bg business-areas" aria-labelledby="business-areas-heading">
        <div className="container">
          <SectionHeading
            eyebrow="BUSINESS AREAS"
            heading="Our Four Core Business Areas"
            description="Services delivered across technical maintenance, training, supply, and renewable energy."
          />
          <div className="business-grid">
            {[
              { title: 'Technical Maintenance', text: 'Equipment, electrical, preventive, corrective maintenance and technical inspections.' },
              { title: 'Technical Training', text: 'Practical training, technical workshops, and learning opportunities for professional growth.' },
              { title: 'Tools & Materials Supply', text: 'Quality tools, equipment, and technical materials for projects and daily operations.' },
              { title: 'Renewable Energy Systems', text: 'Solar energy solutions and system maintenance where offered.' },
            ].map((a) => (
              <div key={a.title} className="business-card">
                <h4>{a.title}</h4>
                <p className="text-muted">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact-card-section">
        <div className="container">
          <div className="contact-grid">
            <ContactCard icon="location" title="Location">
              {COMPANY.location}
            </ContactCard>
            <ContactCard icon="email" title="Email">
              <a href={`mailto:${''}`}>{COMPANY.email}</a>
            </ContactCard>
            <ContactCard icon="phone" title="Phone">
              <a href={`tel:${''}`}>{COMPANY.phone}</a>
            </ContactCard>
          </div>
        </div>
      </section>
    </div>
  )
}

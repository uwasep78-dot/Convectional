import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage.js'
import { SectionHeading } from '../../components/common/SectionHeading.jsx'
import { ServiceCard } from '../../components/cards/ServiceCard.jsx'
import { ProjectCard } from '../../components/cards/ProjectCard.jsx'
import { ProductCard } from '../../components/cards/ProductCard.jsx'
import { PlaceholderImg } from '../../components/common/PlaceholderImg.jsx'
import { Button } from '../../components/common/Button.jsx'
import { DEMO_MODE_NOTICE } from '../../config/company.js'
import { DEMO_PRODUCTS } from '../../data/mockProducts.js'
import { DEMO_PROJECTS } from '../../data/mockProjects.js'
import { CORE_SERVICES } from '../../config/company.js'

export const SERVICE_ENTRIES = [
  {
    key: 'maintenance',
    title: 'Technical Maintenance',
    description: 'Technical maintenance services designed to support reliable equipment operation and efficient systems.',
    icon: 'maintenance',
    href: '/services/technical-maintenance',
  },
  {
    key: 'training',
    title: 'Technical Training',
    description: 'Practical technical learning opportunities designed to develop skills and support professional growth.',
    icon: 'training',
    href: '/services/technical-training',
  },
  {
    key: 'supplies',
    title: 'Tools & Materials Supply',
    description: 'Tools, equipment, and technical materials to support projects, maintenance, and daily operations.',
    icon: 'supplies',
    href: '/services/tools-materials-supply',
  },
  {
    key: 'renewable',
    title: 'Renewable Energy Systems',
    description: 'Renewable energy solutions, including solar-related services and system maintenance where offered.',
    icon: 'renewable',
    href: '/services/renewable-energy-systems',
  },
]

export default function Home() {
  const { t, lang } = useLanguage()
  return (
    <div className="page home">
      <div className="demo-banner">
        {DEMO_MODE_NOTICE} — {t('common.demoMode', lang)}. {t('common.required', lang)}.
      </div>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-content">
            <p className="hero-eyebrow">{t('hero.eyebrow', lang)}</p>
            <h1 id="hero-heading">
              {t('hero.heading', lang)} <span className="hero-highlight">{t('hero.headingHighlight', lang)}</span>
            </h1>
            <p className="hero-description">{t('hero.description', lang)}</p>
            <div className="hero-actions">
              <Link to="/services" className="btn hero-btn-primary">{t('hero.primary', lang)}</Link>
              <Link to="/about" className="btn hero-btn-secondary">{t('hero.secondary', lang)}</Link>
            </div>
          </div>
          <div className="hero-image">
            <PlaceholderImg
              label="Hero - engineers working with solar panels and industrial equipment (replace with company photo)"
              className="hero-img"
            />
          </div>
        </div>
      </section>

      <section className="section-bg" aria-labelledby="services-heading">
        <div className="container">
          <SectionHeading
            eyebrow={t('services.heading', lang) && 'CORE SERVICES'}
            heading={t('services.heading', lang)}
            description={t('services.description', lang)}
          />
          <div className="services-grid">
            {SERVICE_ENTRIES.map((svc) => (
              <ServiceCard
                key={svc.key}
                serviceKey={svc.key}
                title={svc.title}
                description={svc.description}
                href={svc.href}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="about-heading">
        <div className="container about-inner">
          <div className="about-image">
            <PlaceholderImg
              label="About us - industrial maintenance or engineering imagery (replace with company photo)"
              className="about-img"
            />
            <p className="about-caption">Technical team at work (sample imagery - replace with company photograph)</p>
          </div>
          <div className="about-content">
            <span className="eyebrow">ABOUT US</span>
            <h2 id="about-heading">Building a Stronger Future Together</h2>
            <p>{t('about.intro', lang)}</p>
            <div className="about-grid">
              <div>
                <h3>Mission</h3>
                <p>{t('about.mission', lang)}</p>
              </div>
              <div>
                <h3>Vision</h3>
                <p>{t('about.vision', lang)}</p>
              </div>
            </div>
            <div className="about-values">
              <h3>Our Values</h3>
              <div className="values-list">
                {t('about.values', lang).map((v) => (
                  <div key={v.title} className="value-item">
                    <strong>{v.title}</strong> - {v.description}
                  </div>
                ))}
              </div>
            </div>
            <Link to="/about" className="btn btn-secondary">
              {t('about.learnMore', lang)}
            </Link>
          </div>
        </div>
      </section>

      <section className="section-bg" aria-labelledby="projects-heading">
        <div className="container">
          <SectionHeading
            eyebrow="FEATURED WORK"
            heading={t('projects.heading', lang)}
            description={t('projects.description', lang)}
          />
          <div className="projects-actions">
            <Link to="/projects" className="btn btn-outline">
              {t('projects.viewAll', lang)}
            </Link>
          </div>
          <div className="projects-grid">
            {DEMO_PROJECTS.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="products-heading">
        <div className="container">
          <SectionHeading
            eyebrow="PRODUCTS & SUPPLIES"
            heading={t('products.heading', lang)}
            description={t('products.description', lang)}
          />
          <div className="products-grid">
            {DEMO_PRODUCTS.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-navy" aria-labelledby="values-heading">
        <div className="container">
          <SectionHeading
            eyebrow="WHY CHOOSE US"
            heading={t('values.heading', lang)}
            center
          />
          <div className="values-grid">
            {t('values.items', lang).map((v) => (
              <div key={v.title} className="value-card">
                <h3>{v.title}</h3>
                <p className="text-muted">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="cta-inner">
          <div className="cta-content">
            <h2 id="cta-heading">{t('cta.heading', lang)}</h2>
            <p id="cta-description">{t('cta.description', lang)}</p>
          </div>
          <div className="cta-actions">
            <Link to="/quotation" className="btn">{t('cta.quotation', lang)}</Link>
            <Link to="/contact" className="btn btn-outline">{t('cta.contact', lang)}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

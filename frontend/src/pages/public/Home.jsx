import { Link } from 'react-router-dom'

const navigation = [
  ['Home', '/'],
  ['About Us', '/about'],
  ['Services', '/services'],
  ['Training', '/training'],
  ['Maintenance', '/services/technical-maintenance'],
  ['Products', '/products'],
  ['Projects', '/projects'],
  ['Contact', '/contact'],
  ['Login', '/login'],
  ['Register', '/register'],
]

const services = [
  ['Technical Training', '/training'],
  ['Electrical Engineering', '/services'],
  ['Technical Maintenance', '/services/technical-maintenance'],
  ['Tools & Materials Supply', '/services/tools-materials-supply'],
  ['Renewable Energy Systems', '/services/renewable-energy-systems'],
]

export default function Home() {
  return (
    <div>
      <header className="header">
        <div className="topbar">
          <Link className="logo" to="/" aria-label="CCR home">
            <img src="/images/logo.png" alt="" width="40" />
            <span>Conventional Complex & Duties and Renewable System Ltd.</span>
          </Link>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            <a href="tel:+250783024760">0783024760</a>
            {' · '}
            <a href="mailto:ccdrs4@gmail.com">ccdrs4@gmail.com</a>
            {' · Musanze, Rwanda'}
          </div>
        </div>
        <nav className="navbar" aria-label="Main navigation">
          <ul>
            {navigation.map(([label, path]) => (
              <li key={label}><Link to={path}>{label}</Link></li>
            ))}
          </ul>
        </nav>
      </header>
      <section className="hero">
        <div className="container">
          <h1>Your Partner in Technical Solutions and Renewable Energy</h1>
          <p>Conventional Complex & Duties and Renewable System Ltd. provides professional services in technical training, electrical engineering, maintenance, supply of tools and materials, and renewable energy systems for individuals, businesses and organizations.</p>
          <Link className="btn btn-primary" to="/quotation">Get a Quote</Link>{' '}
          <Link className="btn btn-secondary" to="/services">Our Services</Link>
        </div>
      </section>
      <section className="services" aria-label="Our services">
        {services.map(([name, path]) => (
          <article className="card" key={name}>
            <h3>{name}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Professional service by CCR.</p>
            <Link to={path}>Learn more</Link>
          </article>
        ))}
      </section>
      <footer className="footer"><div className="container">
        <div><h4>CCR</h4><p style={{fontSize:13,color:'#cbd5e1'}}>Conventional Complex & Duties and Renewable System Ltd.</p></div>
        <div><h4>Contact</h4><p style={{fontSize:13,color:'#cbd5e1'}}><a href="tel:+250783024760">0783024760</a><br/><a href="mailto:ccdrs4@gmail.com">ccdrs4@gmail.com</a><br/>Muhoza Sector, Musanze District, Northern Province, Rwanda.</p></div>
        <div><h4>Quick Links</h4><p style={{fontSize:13,color:'#cbd5e1'}}><Link to="/">Home</Link> · <Link to="/services">Services</Link> · <Link to="/contact">Contact</Link> · <Link to="/login">Login</Link></p></div>
      </div></footer>
    </div>
  )
}

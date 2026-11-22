import { NavLink } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/assets/company-logo.png" alt="" className="footer-logo" />
          <div>
            <strong className="footer-brand-name">CONVENTIONAL COMPLEX & DUTIES AND RENEWABLE SYSTEM LTD.</strong>
            <p className="footer-brand-text">Providing professional technical services, training, quality tools and materials, and sustainable energy solutions.</p>
            <p className="footer-demo text-xs text-muted">Demo mode - contact details are configurable placeholders.</p>
          </div>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/about">About Us</NavLink></li>
              <li><NavLink to="/services">Services</NavLink></li>
              <li><NavLink to="/projects">Projects</NavLink></li>
              <li><NavLink to="/products">Products & Supplies</NavLink></li>
              <li><NavLink to="/training">Technical Training</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Services</h4>
            <ul className="footer-links">
              <li><NavLink to="/services/technical-maintenance">Technical Maintenance</NavLink></li>
              <li><NavLink to="/services/technical-training">Technical Training</NavLink></li>
              <li><NavLink to="/services/tools-materials-supply">Tools & Materials Supply</NavLink></li>
              <li><NavLink to="/services/renewable-energy-systems">Renewable Energy Systems</NavLink></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-links">
              <li><a href="mailto:">[company-email@example.com]</a></li>
              <li><a href="tel:">[+250 XXX XXX XXX]</a></li>
              <li>[Company location to be configured]</li>
              <li>Mon - Fri: 8:00 AM - 5:00 PM</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Follow Us</h4>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="Instagram">Instagram</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-use">Terms of Use</a>
          <span>&copy; {year} CONVENTIONAL COMPLEX & DUTIES AND RENEWABLE SYSTEM LTD. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

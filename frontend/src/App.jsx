import { useState, useEffect } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { FaArrowRight, FaBolt, FaCheckCircle, FaChevronDown, FaClock, FaEnvelope, FaFacebookF, FaGraduationCap, FaLeaf, FaMapMarkerAlt, FaPhone, FaQuoteRight, FaSolarPanel, FaTools, FaWrench, FaBars, FaTimes, FaLightbulb, FaHardHat, FaShieldAlt, FaChartLine, FaSearch, FaPaperPlane, FaClipboardList, FaBoxOpen, FaUsers, FaProjectDiagram, FaCog, FaSignOutAlt } from 'react-icons/fa'
import ChatBot from './components/common/ChatBot.jsx'
import ProjectMap from './pages/public/ProjectMap.jsx'
import VideoConsultation from './pages/public/VideoConsultation.jsx'
import CertificationVerify from './pages/public/CertificationVerify.jsx'
import Login from './pages/public/Login.jsx'
import Register from './pages/public/Register.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import AdminFull from './components/AdminFull.jsx'

const COMPANY = {
  name: 'CONVENTIONAL COMPLEX & DUTIES AND RENEWABLE SYSTEM LTD.', short: 'CCR',
  tagline: 'Skills · Solutions · Sustainability',
  phone: '+250 783 024 760', email: 'ccdrs4@gmail.com', location: 'Muhoza Sector, Musanze, Northern Province, Rwanda',
  hours: 'Monday – Friday, 8:00 AM – 5:00 PM',
}
const services = [
  { slug: 'technical-maintenance', title: 'Technical Maintenance', short: 'Reliable care for equipment and technical systems.', text: 'Keep your equipment operating safely and efficiently with planned maintenance, troubleshooting, repairs, inspections, and practical technical support.', icon: FaWrench, color: 'blue', points: ['Preventive maintenance and inspections', 'Fault finding and troubleshooting', 'Repair coordination and technical support', 'Maintenance planning and reporting'] },
  { slug: 'technical-training', title: 'Technical Training', short: 'Build practical skills for a changing world.', text: 'Practical training designed to help learners strengthen technical knowledge, build confidence, and prepare for real workplace challenges.', icon: FaGraduationCap, color: 'orange', points: ['Practical, hands-on learning', 'Technical skills development', 'Workplace safety fundamentals', 'Training pathways for teams and individuals'] },
  { slug: 'tools-materials-supply', title: 'Tools & Materials Supply', short: 'The right tools and materials for the job.', text: 'Source tools, equipment, and technical materials for maintenance, construction, electrical work, and project delivery.', icon: FaTools, color: 'green', points: ['Tools and workshop essentials', 'Electrical tools and materials', 'Project and maintenance supplies', 'Support selecting suitable equipment'] },
  { slug: 'renewable-energy-systems', title: 'Renewable Energy Systems', short: 'Smarter energy solutions for a sustainable future.', text: 'Explore renewable energy services focused on solar solutions, energy reliability, system support, and responsible long-term performance.', icon: FaLeaf, color: 'green', points: ['Solar system consultation', 'System planning and installation support', 'Inspection and maintenance', 'Energy awareness and efficiency'] },
]
const projects = [
  { title: 'Technical Maintenance Support', category: 'Maintenance', icon: FaWrench, text: 'A practical approach to equipment care, inspections, and reliable day-to-day operations.' },
  { title: 'Skills Development Programme', category: 'Training', icon: FaGraduationCap, text: 'Building confidence and technical capability through structured, hands-on learning.' },
  { title: 'Renewable Energy Solutions', category: 'Renewable energy', icon: FaLeaf, text: 'Supporting a more sustainable future with energy-conscious solutions and technical guidance.' },
]
const products = [
  { name: 'Electrical Hand Tools', category: 'Electrical', description: 'Everyday tools for electrical installation and maintenance work.', icon: FaTools },
  { name: 'Safety Equipment', category: 'Safety', description: 'Personal protection essentials for safer technical work.', icon: FaShieldAlt },
  { name: 'Solar Accessories', category: 'Renewable energy', description: 'Selected accessories and materials for solar energy projects.', icon: FaSolarPanel },
  { name: 'Workshop Essentials', category: 'Maintenance', description: 'Useful tools and consumables for maintenance and repair tasks.', icon: FaCog },
]
const courses = [
  { title: 'Electrical Installation Fundamentals', level: 'Beginner', duration: 'Course duration on request', text: 'Understand essential electrical principles, tools, safe working practices, and installation fundamentals.' },
  { title: 'Technical Maintenance Basics', level: 'Beginner', duration: 'Course duration on request', text: 'Learn practical maintenance planning, inspection routines, and systematic fault identification.' },
  { title: 'Solar Energy Systems Introduction', level: 'Introductory', duration: 'Course duration on request', text: 'Explore solar components, system basics, energy safety, and ongoing care.' },
]
const readStore = (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] } }
function BrandLogo({ small = false }) { return <div className={`brand ${small ? 'brand-small' : ''}`} aria-label="CCR"><img src="/assets/company-logo.png" alt="CCR company logo" /><span><strong>CCR</strong><small>Skills · Solutions · Sustainability</small></span></div> }
function Header() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const { user, logout } = useAuth()
  const nav = user
    ? [['About us','/about'],['Services','/services'],['Projects','/projects'],['Products','/products'],['Training','/training'],['Contact','/contact']]
    : [['About us','/about'],['Services','/services'],['Projects','/projects'],['Products','/products'],['Training','/training'],['Contact','/contact']]
  return <>
    <div className="topbar"><div className="wrap topbar-inner"><span><FaMapMarkerAlt /> Musanze, Rwanda</span><span><FaPhone /> {COMPANY.phone}</span><span className="top-email"><FaEnvelope /> {COMPANY.email}</span><span className="top-hours"><FaClock /> Mon–Fri: 8:00–17:00</span></div></div>
    <header className="site-header"><div className="wrap header-inner"><BrandLogo /><nav className={open?'main-nav is-open':'main-nav'}>{nav.map(([label,path])=><NavLink key={path} to={path} end={path==='/'} onClick={()=>setOpen(false)} className={({isActive})=>isActive?'nav-item active':'nav-item'}>{label}</NavLink>)}<Link to="/quotation" className="btn btn-primary nav-quote" onClick={()=>setOpen(false)}>Request a quotation <FaArrowRight /></Link>{user && <div className="nav-user"><span>{user.name}</span><button className="btn-link" onClick={()=>{logout();setOpen(false)}}>Sign out <FaSignOutAlt /></button></div>}{!user && <div className="nav-auth"><Link to="/login" className="btn btn-outline nav-login" onClick={()=>setOpen(false)}>Sign in</Link><Link to="/register" className="btn btn-outline nav-register" onClick={()=>setOpen(false)}>Register</Link></div>}</nav><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label={open?'Close menu':'Open menu'}>{open?<FaTimes/>:<FaBars/>}</button></div></header>
  </>
}
function Footer() { return <footer className="footer"><div className="wrap footer-main"><div className="footer-about"><BrandLogo /><p>Practical technical services, skills development, quality supplies, and renewable energy solutions for people and businesses.</p><div className="footer-social"><a href="mailto:ccdrs4@gmail.com" aria-label="Email"><FaEnvelope/></a><a href="https://www.facebook.com/" aria-label="Facebook"><FaFacebookF/></a></div></div><div><h4>Explore</h4><Link to="/about">About us</Link><Link to="/services">Our services</Link><Link to="/projects">Projects</Link><Link to="/training">Technical training</Link></div><div><h4>What we do</h4>{services.map(s=><Link key={s.slug} to={`/services/${s.slug}`}>{s.title}</Link>)}<Link to="/products">Tools & supplies</Link></div><div><h4>Get in touch</h4><p><FaMapMarkerAlt/> {COMPANY.location}</p><a href="tel:+250783024760"><FaPhone/> {COMPANY.phone}</a><a href="mailto:ccdrs4@gmail.com"><FaEnvelope/> {COMPANY.email}</a><Link to="/contact" className="footer-contact">Contact our team <FaArrowRight/></Link></div></div><div className="footer-bottom"><div className="wrap"><span>© {new Date().getFullYear()} CCR. All rights reserved.</span><span>Skills · Solutions · Sustainability</span><Link to="/privacy-policy">Privacy</Link><Link to="/terms-of-use">Terms</Link></div></div></footer> }
function PageHero({eyebrow,title,description,crumb='Home'}) { return <section className="page-hero"><div className="wrap"><div className="breadcrumbs"><span>{title}</span></div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description&&<p className="page-hero-desc">{description}</p>}</div><div className="hero-orb orb-one"/><div className="hero-orb orb-two"/></section> }
function SectionTitle({eyebrow,title,description,center=false}) { return <div className={`section-title ${center?'center':''}`}><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description&&<p>{description}</p>}</div> }
function ServiceCard({service}) { const Icon=service.icon; return <article className="service-card"><div className={`icon-box ${service.color}`}><Icon/></div><h3>{service.title}</h3><p>{service.short}</p><Link to={`/services/${service.slug}`} className="text-link">Explore service <FaArrowRight/></Link></article> }
function Home() { return <><section className="hero-home"><div className="hero-shape"/><div className="wrap hero-grid"><div className="hero-copy"><div className="hero-kicker"><span className="kicker-dot"/> ENGINEERING · TRAINING · SUSTAINABILITY</div><h1>Building skills.<br/><span>Powering progress.</span></h1><p className="hero-lead">Practical technical services, reliable supplies, and renewable energy solutions that help people and businesses move forward.</p><div className="hero-buttons"><Link to="/services" className="btn btn-primary">Explore our services <FaArrowRight/></Link><Link to="/contact" className="btn btn-outline">Talk to our team</Link></div><div className="hero-trust"><div className="trust-avatars"><span>CCR</span><span><FaTools/></span><span><FaLeaf/></span></div><div><strong>Skills · Solutions · Sustainability</strong><small>One partner for practical progress</small></div></div></div><div className="hero-visual"><div className="hero-logo-card"><img src="/assets/company-logo.png" alt="Conventional Complex & Duties and Renewable System Ltd logo"/><div className="logo-card-caption"><span className="status-dot"/> Your technical solutions partner</div></div><div className="floating-card floating-top"><span className="floating-icon orange"><FaBolt/></span><span><strong>Energy solutions</strong><small>Built for tomorrow</small></span></div><div className="floating-card floating-bottom"><span className="floating-icon green"><FaGraduationCap/></span><span><strong>Practical training</strong><small>Skills that move you forward</small></span></div><div className="visual-ring"/></div></div><div className="wrap hero-bottom"><span><FaCheckCircle/> Practical and professional</span><span><FaCheckCircle/> Focus on safety and quality</span><span><FaCheckCircle/> Sustainability-minded solutions</span></div></section>
  <section className="section"><div className="wrap"><SectionTitle eyebrow="WHAT WE DO" title="Solutions designed around your needs" description="From technical skills to equipment support and renewable energy, we help turn challenges into practical next steps." center/><div className="services-grid">{services.map(s=><ServiceCard key={s.slug} service={s}/>)}</div><div className="center-button"><Link to="/services" className="btn btn-dark">View all services <FaArrowRight/></Link></div></div></section>
  <section className="section section-tint"><div className="wrap split-section"><div className="about-visual"><div className="about-graphic"><div className="graphic-icon"><FaHardHat/></div><div className="graphic-line"/><div className="graphic-stats"><span><strong>01</strong><small>Skills</small></span><span><strong>02</strong><small>Solutions</small></span><span><strong>03</strong><small>Sustainability</small></span></div></div><div className="round-stamp"><FaQuoteRight/><span>Built on<br/>practicality</span></div></div><div className="split-copy"><p className="eyebrow">ABOUT CCR</p><h2>Practical expertise.<br/><span>Purposeful impact.</span></h2><p>We bring together technical maintenance, professional skills development, tools and materials supply, and renewable energy systems under one service-focused company.</p><p>Our approach is straightforward: understand the need, recommend a practical solution, and put quality, safety, and long-term value first.</p><div className="check-list"><span><FaCheckCircle/> Professional, service-minded approach</span><span><FaCheckCircle/> Learning and technical capability</span><span><FaCheckCircle/> A sustainable outlook</span></div><Link to="/about" className="btn btn-primary">Get to know us <FaArrowRight/></Link></div></div></section>
  <section className="section"><div className="wrap"><SectionTitle eyebrow="OUR APPROACH" title="Good work starts with the right principles" description="A dependable partner listens carefully, works responsibly, and keeps the outcome in focus." center/><div className="values-grid"><div className="value-card"><div className="value-icon"><FaShieldAlt/></div><h3>Quality & safety</h3><p>Responsible work practices and a focus on dependable outcomes.</p></div><div className="value-card"><div className="value-icon orange"><FaLightbulb/></div><h3>Practical innovation</h3><p>Solutions selected for real needs, not complexity for its own sake.</p></div><div className="value-card"><div className="value-icon green"><FaLeaf/></div><h3>Sustainability</h3><p>Thoughtful energy choices and a long-term view of resources.</p></div><div className="value-card"><div className="value-icon"><FaUsers/></div><h3>People & skills</h3><p>Investing in technical capability, confidence, and collaboration.</p></div></div></div></section>
  <section className="cta-band"><div className="wrap cta-inner"><div><p className="eyebrow light">LET'S WORK TOGETHER</p><h2>Have a project or technical challenge?</h2><p>Tell us what you need. Our team can help you explore the right next step.</p></div><div className="cta-actions"><Link to="/quotation" className="btn btn-white">Request a quotation <FaArrowRight/></Link><Link to="/contact" className="cta-text-link">Contact us</Link></div></div></section></> }
function About() { return <><PageHero eyebrow="ABOUT CCR" title="A practical partner for progress" description="We connect technical services, skills development, quality supplies, and sustainable energy thinking."/><section className="section"><div className="wrap split-section"><div className="about-visual"><div className="about-graphic about-graphic-large"><img src="/assets/company-logo.png" alt="CCR brand logo"/></div></div><div className="split-copy"><p className="eyebrow">WHO WE ARE</p><h2>Skills, solutions, and sustainability in one place.</h2><p>CONVENTIONAL COMPLEX & DUTIES AND RENEWABLE SYSTEM LTD. is focused on helping customers access practical technical services, training, tools and materials, and renewable energy solutions.</p><p>We believe the best results come from clear communication, a commitment to safety, and solutions that respond to the real needs of each customer.</p><div className="mission-cards"><div><strong>Our mission</strong><p>Deliver practical services and learning that help people, equipment, and projects perform better.</p></div><div><strong>Our vision</strong><p>Contribute to a technically skilled, resource-conscious, and sustainable future.</p></div></div></div></div></section><section className="section section-tint"><div className="wrap"><SectionTitle eyebrow="OUR VALUES" title="The standards behind our work" center/><div className="values-grid">{[['Integrity','Clear communication and responsible service.'],['Quality','Careful work and attention to detail.'],['Learning','Developing practical knowledge and capability.'],['Sustainability','Considering long-term impact and energy efficiency.']].map(([t,d],i)=><div className="value-card" key={t}><div className={`value-icon ${i===1?'orange':i===3?'green':''}`}>{i===0?<FaShieldAlt/>:i===1?<FaCheckCircle/>:i===2?<FaGraduationCap/>:<FaLeaf/>}</div><h3>{t}</h3><p>{d}</p></div>)}</div></div></section></> }
function Services() { return <><PageHero eyebrow="OUR SERVICES" title="Technical solutions for real-world needs" description="Explore the ways we support maintenance, training, technical supply, and renewable energy."/><section className="section"><div className="wrap"><div className="services-grid services-grid-page">{services.map(s=><ServiceCard key={s.slug} service={s}/>)}</div></div></section></> }
function ServiceDetail() { const {slug}=useParams(); const s=services.find(x=>x.slug===slug); if(!s) return <NotFound/>; const Icon=s.icon; return <><PageHero eyebrow="OUR SERVICES" title={s.title} description={s.short}/><section className="section"><div className="wrap detail-layout"><div className="detail-main"><div className={`detail-icon ${s.color}`}><Icon/></div><h2>Practical support, focused on your goals.</h2><p>{s.text}</p><h3>How we can help</h3><div className="check-list large-checks">{s.points.map(p=><span key={p}><FaCheckCircle/>{p}</span>)}</div><p className="note-box">Service scope, availability, and delivery arrangements are confirmed after discussing your requirements.</p><Link to="/quotation" className="btn btn-primary">Request this service <FaArrowRight/></Link></div><aside className="detail-aside"><h3>Need help deciding?</h3><p>Share a little about your project and we can discuss a suitable next step.</p><Link to="/contact" className="btn btn-dark btn-full">Contact our team</Link><div className="aside-contact"><span><FaPhone/>{COMPANY.phone}</span><span><FaEnvelope/>{COMPANY.email}</span></div></aside></div></section><section className="section section-tint"><div className="wrap"><SectionTitle eyebrow="RELATED SERVICES" title="More ways we can help" center/><div className="services-grid">{services.filter(x=>x.slug!==slug).slice(0,3).map(x=><ServiceCard key={x.slug} service={x}/>)}</div></div></section></> }
function Projects() { const [filter,setFilter]=useState('All'); const cats=['All',...new Set(projects.map(p=>p.category))]; const list=projects.filter(p=>filter==='All'||p.category===filter); return <><PageHero eyebrow="OUR WORK" title="Practical work. Meaningful outcomes." description="A look at the kinds of technical support and skills initiatives our services are designed to enable."/><section className="section"><div className="wrap"><div className="filter-row">{cats.map(c=><button key={c} className={filter===c?'filter-chip selected':'filter-chip'} onClick={()=>setFilter(c)}>{c}</button>)}</div><div className="project-grid">{list.map((p,i)=>{const Icon=p.icon;return <article className="project-card" key={p.title}><div className={`project-art art-${i+1}`}><span className="project-number">0{i+1}</span><Icon/></div><div className="project-content"><span className="tag">{p.category}</span><h3>{p.title}</h3><p>{p.text}</p><Link to="/contact" className="text-link">Discuss a similar project <FaArrowRight/></Link></div></article>})}</div><p className="disclaimer">Project cards describe service areas and illustrative examples, not a claim of completed client projects.</p></div></section></> }
function Products() { const [query,setQuery]=useState(''); const [category,setCategory]=useState('All'); const cats=['All',...new Set(products.map(p=>p.category))]; const list=products.filter(p=>(category==='All'||p.category===category)&&`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(query.toLowerCase())); return <><PageHero eyebrow="TOOLS & MATERIALS" title="Supply for your next job" description="Explore example product categories and tell us what your project requires."/><section className="section"><div className="wrap"><div className="catalog-controls"><label className="search-field"><FaSearch/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tools and supplies…"/></label><div className="filter-row compact">{cats.map(c=><button key={c} className={category===c?'filter-chip selected':'filter-chip'} onClick={()=>setCategory(c)}>{c}</button>)}</div></div><div className="product-grid">{list.map(p=>{const Icon=p.icon;return <article className="product-card" key={p.name}><div className="product-art"><Icon/></div><span className="tag">{p.category}</span><h3>{p.name}</h3><p>{p.description}</p><Link to={`/quotation?item=${encodeURIComponent(p.name)}`} className="text-link">Ask about availability <FaArrowRight/></Link></article>})}</div>{list.length===0&&<div className="empty-state">No matching categories found. Try another search.</div>}<p className="disclaimer">Items shown are illustrative categories, not live stock listings. Availability and prices must be confirmed by the company.</p></div></section></> }
function Training() { 
  const [form, setForm] = useState({ fullName:'', name:'', email:'', phone:'', phoneNumber:'', course:'', message:'', trainingId:'', courseId:'' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const change = (e) => setForm({...form, [e.target.name]: e.target.value})
  async function submit(e){
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await api.post('/enrollments', {
        fullName: form.fullName || form.name,
        name: form.fullName || form.name,
        email: form.email,
        phone: form.phone || form.phoneNumber,
        phoneNumber: form.phone || form.phoneNumber,
        course: form.course,
        courseId: form.courseId || form.trainingId,
        trainingId: form.trainingId || form.courseId,
        message: form.message,
        notes: form.message
      })
      setSent(true)
      setForm({ fullName:'', name:'', email:'', phone:'', phoneNumber:'', course:'', message:'', trainingId:'', courseId:'' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return <><PageHero eyebrow="TECHNICAL TRAINING" title="Apply for Training" description="Submit your training application directly - no account required."/><section className="section"><div className="wrap"><div className="course-intro"><div><p className="eyebrow">TRAINING APPLICATION</p><h2>Apply without signing in</h2><p>Anyone can apply for our training programs. Fill out the form below to submit your application.</p></div><div className="course-stat"><FaGraduationCap/><strong>Open applications</strong><span>Apply directly here</span></div></div>
  <div className="wrap" style={{maxWidth:800}}>
    <form className="form-card" onSubmit={submit}>
      <h3>Training Application Form</h3>
      <p>All fields marked with * are required.</p>
      {sent && <div className="success-message"><FaCheckCircle/> Application submitted successfully. We will contact you soon.</div>}
      {error && <div className="error-msg">{error}</div>}
      {!sent && (
        <>
          <div className="form-row">
            <label>Full Name *<input required name="fullName" value={form.fullName} onChange={change} placeholder="Enter your full name"/></label>
            <label>Email *<input type="email" required name="email" value={form.email} onChange={change} placeholder="you@example.com"/></label>
          </div>
          <div className="form-row">
            <label>Phone Number *<input required name="phone" value={form.phone} onChange={change} placeholder="+250..."/></label>
            <label>Course/Program *<input required name="course" value={form.course} onChange={change} placeholder="e.g. Electrical Installation"/></label>
          </div>
          <div className="form-group">
            <label>Additional Information<textarea name="message" value={form.message} onChange={change} rows="4" placeholder="Tell us about your goals, availability..."/></label>
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</button>
        </>
      )}
    </form>
  </div>
  <div className="wrap" style={{marginTop:40}}>
    <SectionTitle eyebrow="AVAILABLE COURSES" title="Our Training Programs" description="Browse our training offerings." center/>
    <div className="course-grid">{courses.map((c,i)=><article className="course-card" key={c.title}><div className={`course-art course-art-${i+1}`}><FaGraduationCap/><span>0{i+1}</span></div><div className="course-body"><div className="course-meta"><span>{c.level}</span><span>{c.duration}</span></div><h3>{c.title}</h3><p>{c.text}</p></div></article>)}</div>
        </div>
      </div>
    </section>
  </>
}

function Contact() {
  const [sent,setSent]=useState(false);
  const [form,setForm]=useState({name:'',email:'',phone:'',subject:'',message:''});
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  async function submit(e){
    e.preventDefault();
    try {
      await api.post('/contact', form);
      setSent(true);
      setForm({name:'',email:'',phone:'',subject:'',message:''});
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send enquiry. Please try again.');
    }
  }
  return <><PageHero eyebrow="CONTACT US" title="Let's talk about what you need" description="Ask a question, discuss a service, or tell us about a project. We will help you identify a practical next step."/><section className="section"><div className="wrap contact-layout"><div className="contact-info"><p className="eyebrow">GET IN TOUCH</p><h2>We'd be glad to hear from you.</h2><p>Share your needs and include any useful details so we can direct your enquiry appropriately.</p><div className="contact-detail"><span className="contact-icon"><FaPhone/></span><div><small>Call us</small><a href="tel:+250783024760">{COMPANY.phone}</a></div></div><div className="contact-detail"><span className="contact-icon orange"><FaEnvelope/></span><div><small>Email us</small><a href="mailto:ccdrs4@gmail.com">{COMPANY.email}</a></div></div><div className="contact-detail"><span className="contact-icon green"><FaMapMarkerAlt/></span><div><small>Find us</small><strong>{COMPANY.location}</strong></div></div><div className="contact-detail"><span className="contact-icon"><FaClock/></span><div><small>Business hours</small><strong>{COMPANY.hours}</strong></div></div></div><form className="form-card" onSubmit={submit}><h3>Send an enquiry</h3><p>Fields marked with * are required.</p>{sent&&<div className="success-message"><FaCheckCircle/> Enquiry sent successfully.</div>}
  {!sent && (
    <>
      <div className="form-row"><label>Full name *<input required name="name" value={form.name} onChange={change}/></label><label>Email *<input type="email" required name="email" value={form.email} onChange={change}/></label></div>
      <div className="form-row"><label>Phone<input name="phone" value={form.phone} onChange={change}/></label><label>Subject<input name="subject" value={form.subject} onChange={change}/></label></div>
      <div className="form-group"><label>Message *<textarea required name="message" value={form.message} onChange={change} rows="5"/></label></div>
      <button className="btn btn-primary btn-full" type="submit" disabled={sent}>{sent ? 'Sent!' : 'Send enquiry'}</button>
    </>
  )}
  </form></div></section></> }
function Quotation() {
  const [done,setDone]=useState(false);
  const params=new URLSearchParams(window.location.search);
  const [form,setForm]=useState({name:'',organization:'',email:'',phone:'',service:'',details:params.get('item')?`I would like information about: ${params.get('item')}`:''});
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  async function submit(e){
    e.preventDefault();
    try {
      await api.post('/quotations', form);
      setDone(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quotation. Please try again.');
    }
  }
  return <><PageHero eyebrow="REQUEST A QUOTATION" title="Tell us about your requirements" description="Give us a few details about your project or supply needs. We can then discuss scope, availability, and next steps."/><section className="section"><div className="wrap quotation-layout"><div className="quotation-aside"><div className="quote-icon"><FaClipboardList/></div><h2>A clear brief helps us help you.</h2><p>Include the service you are interested in, any relevant specifications, quantities, or timing, and how you would prefer to be contacted.</p><div className="check-list"><span><FaCheckCircle/> Describe your requirement</span><span><FaCheckCircle/> Include useful project details</span><span><FaCheckCircle/> We can clarify scope together</span></div><div className="quote-contact"><FaPhone/> {COMPANY.phone}<br/><FaEnvelope/> {COMPANY.email}</div></div><form className="form-card" onSubmit={submit}><h3>Quotation request form</h3><p>All fields marked * are required.</p>{done&&<div className="success-message"><FaCheckCircle/> Quotation request sent successfully.</div>}
  {!done && (
    <>
      <div className="form-row"><label>Full name *<input required name="name" value={form.name} onChange={change}/></label><label>Email *<input type="email" required name="email" value={form.email} onChange={change}/></label></div>
      <div className="form-row"><label>Phone<input name="phone" value={form.phone} onChange={change}/></label><label>Service<input name="service" value={form.service} onChange={change}/></label></div>
      <div className="form-group"><label>Details *<textarea required name="details" value={form.details} onChange={change} rows="5"/></label></div>
      <button className="btn btn-primary btn-full" type="submit" disabled={done}>{done ? 'Sent!' : 'Request quotation'}</button>
    </>
  )}
  </form></div></section></> }
function NotFound(){return <><PageHero eyebrow="404 · NOT FOUND" title="We couldn't find that page" description="The page may have moved or the address may be incorrect."/><section className="section"><div className="wrap"><Link to="/" className="btn btn-primary">Go back <FaArrowRight/></Link></div></section></> }
function Legal({terms=false}) { return <><PageHero eyebrow="INFORMATION" title={terms?'Terms of use':'Privacy notice'} description="Important information about this website."/><section className="section"><div className="wrap legal-copy"><div className="notice"><FaLightbulb/><p>This is starter text for a demonstration website, not a reviewed legal policy. Ask a qualified professional to review and adapt it before launch.</p></div><h2>{terms?'Using this website':'Information and enquiries'}</h2><p>This website presents general information about the services, training topics, and product categories associated with {COMPANY.name}. Content is provided for general information and may be updated as the business offering develops.</p><h3>{terms?'Service information':'Information submitted through forms'}</h3><p>{terms?'Descriptions are illustrative and do not constitute a binding offer. Scope, pricing, timing, stock, and availability should be confirmed directly with the company.':'In this demo, form submissions are sent to the CCR backend API. A production website should use secure transmission, access controls, and a clear retention policy.'}</p><h3>Questions</h3><p>Contact <a href="mailto:ccdrs4@gmail.com">{COMPANY.email}</a> for questions about this website. This placeholder notice should be replaced with a policy reflecting the real website and applicable law.</p></div></section></> }
function Admin(){return <AdminFull/>}

function AppRoutes(){const location=useLocation();return <><Header/><ChatBot /><Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/services" element={<Services/>}/><Route path="/services/:slug" element={<ServiceDetail/>}/><Route path="/projects" element={<Projects/>}/><Route path="/products" element={<Products/>}/><Route path="/training" element={<Training/>}/><Route path="/contact" element={<Contact/>}/><Route path="/quotation" element={<Quotation/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/project-map" element={<ProjectMap/>}/><Route path="/video-consultation" element={<VideoConsultation/>}/><Route path="/verify-cert" element={<CertificationVerify/>}/><Route path="/admin" element={<Admin/>}/><Route path="/admin/*" element={<Admin/>}/><Route path="/privacy-policy" element={<Legal/>}/><Route path="/terms-of-use" element={<Legal terms/>}/><Route path="*" element={<NotFound/>}/></Routes><Footer/><a href="mailto:ccdrs4@gmail.com" className="floating-contact" aria-label="Email CCR"><FaEnvelope/></a></>}
export default function App(){return <AuthProvider><AppRoutes /></AuthProvider>}
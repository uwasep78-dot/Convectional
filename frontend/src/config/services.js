// Service configuration - editable service catalogue content
// All technical descriptions are configurable and must be confirmed by the company.
export const SERVICES_CONFIG = {
  maintenance: {
    key: 'maintenance',
    title: 'Technical Maintenance',
    overview:
      'Professional maintenance services designed to keep equipment and systems operating reliably and efficiently.',
    sections: [
      { title: 'Equipment Maintenance', description: 'Routine servicing of technical equipment and machinery.' },
      { title: 'Electrical Maintenance', description: 'Inspection and servicing of electrical installations.' },
      { title: 'Troubleshooting', description: 'Diagnosis and resolution of technical faults.' },
      { title: 'Preventive Maintenance', description: 'Scheduled maintenance to prevent equipment failure.' },
      { title: 'Corrective Maintenance', description: 'Repairs performed after a fault is identified.' },
      { title: 'Technical Inspections', description: 'Periodic inspections to verify system condition and safety.' },
    ],
    benefits: [
      'Reduced equipment downtime',
      'Extended asset lifespan',
      'Improved operational safety',
      'Cost-effective maintenance planning',
    ],
    applications: [
      'Industrial equipment maintenance',
      'Building systems maintenance',
      'Electrical system servicing',
      'Technical facility upkeep',
    ],
    faqs: [
      {
        q: 'What types of maintenance do you offer?',
        a: 'Preventive, corrective, electrical, and general technical maintenance services.',
      },
      {
        q: 'How do I request a maintenance visit?',
        a: 'Use the Request a Quotation form or contact our team directly.',
      },
    ],
  },
  training: {
    key: 'training',
    title: 'Technical Training',
    overview:
      'Practical technical learning opportunities designed to develop skills and support professional growth.',
    sections: [
      { title: 'Practical Training', description: 'Hands-on technical training delivered by experienced instructors.' },
      { title: 'Technical Workshops', description: 'Focused workshops on specific technical topics.' },
      { title: 'Course Schedules', description: 'Published schedules for upcoming courses and sessions.' },
      { title: 'Training Registration', description: 'Registration process for individuals and organizations.' },
      { title: 'Learning Opportunities', description: 'Technical learning paths for career development.' },
    ],
    benefits: [
      'Industry-relevant practical skills',
      'Experienced instructors',
      'Flexible course schedules',
      'Support for professional growth',
    ],
    applications: [
      'Engineering fundamentals',
      'Electrical systems training',
      'Renewable energy systems training',
      'Maintenance technician development',
    ],
    faqs: [
      {
        q: 'Do you issue certificates?',
        a: 'Certificate issuance depends on the course. Contact us for details on each programme.',
      },
      {
        q: 'How do I register for training?',
        a: 'Complete the registration form on the Training page or contact our team.',
      },
    ],
  },
  supplies: {
    key: 'supplies',
    title: 'Tools & Materials Supply',
    overview:
      'Tools, equipment, and technical materials to support projects, maintenance, and daily operations.',
    sections: [
      { title: 'Product Categories', description: 'Solar panels, inverters, cables, protection equipment, hand tools, and more.' },
      { title: 'Equipment Details', description: 'Technical specifications and availability information per product.' },
      { title: 'Materials Requests', description: 'Request specific materials for your project or operation.' },
      { title: 'Product Enquiries', description: 'Ask questions about products before requesting a quotation.' },
      { title: 'Quotation Requests', description: 'Prepare a quotation request for multiple products at once.' },
    ],
    benefits: [
      'Quality tools and materials',
      'Bulk supply for projects',
      'Technical product guidance',
      'Simple quotation process',
    ],
    applications: [
      'Construction projects',
      'Maintenance operations',
      'Electrical installations',
      'Technical workshops',
    ],
    faqs: [
      {
        q: 'Can I request a quotation for multiple products?',
        a: 'Yes. Use the Request a Quote button on product pages to build a quotation list.',
      },
      {
        q: 'Are prices listed online?',
        a: 'Prices are provided through quotations based on your requirements and quantities.',
      },
    ],
  },
  renewable: {
    key: 'renewable',
    title: 'Renewable Energy Systems',
    overview:
      'Renewable energy solutions, including solar-related services and system maintenance where offered.',
    sections: [
      { title: 'Solar Energy Solutions', description: 'Solar power solutions for homes, businesses, and institutions.' },
      { title: 'Solar System Installation', description: 'Installation services where offered by the company.' },
      { title: 'Solar System Maintenance', description: 'Ongoing maintenance for solar energy systems.' },
      { title: 'Energy Consultation', description: 'Consultation on renewable energy options and system sizing.' },
      { title: 'Renewable Energy Products', description: 'Solar panels, inverters, batteries, and related products.' },
    ],
    benefits: [
      'Reduced energy costs',
      'Environmentally sustainable',
      'Reliable off-grid power',
      'Professional system design',
    ],
    applications: [
      'Residential solar systems',
      'Commercial solar installations',
      'Solar water pumping',
      'Backup power systems',
    ],
    faqs: [
      {
        q: 'Do you guarantee savings from solar installation?',
        a: 'No. Savings depend on usage, location, and system design. A professional assessment is required.',
      },
      {
        q: 'Is the solar savings calculator a substitute for a site assessment?',
        a: 'No. It provides preliminary estimates only.',
      },
    ],
  },
}

export default SERVICES_CONFIG

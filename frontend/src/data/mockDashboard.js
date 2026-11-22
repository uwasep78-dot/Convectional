// Demo dashboard data - SAMPLE CONTENT ONLY, clearly marked.
// Do not present mock figures as actual business performance.
export const DEMO_DASHBOARD = {
  stats: [
    { title: 'Quotation Requests', value: '12', subtitle: 'This month', trend: { value: '12%', positive: true } },
    { title: 'Maintenance Requests', value: '7', subtitle: 'Open requests', trend: { value: '5%', positive: false } },
    { title: 'Catalogue Items', value: '34', subtitle: 'Products listed', trend: { value: '8%', positive: true } },
    { title: 'Published Services', value: '4', subtitle: 'Service pages', trend: { value: '0%', positive: true } },
    { title: 'Training Registrations', value: '6', subtitle: 'Pending review', trend: { value: '3%', positive: true } },
    { title: 'Recent Activity', value: '22', subtitle: 'Last 7 days', trend: { value: '10%', positive: true } },
  ],
  recentActivity: [
    { item: 'Quotation Request', description: 'Solar panel quotation submitted', time: '2 hours ago', type: 'quotation' },
    { item: 'Maintenance Request', description: 'Factory equipment service assigned', time: '5 hours ago', type: 'maintenance' },
    { item: 'New Product', description: 'Cable stock item added to catalogue', time: '1 day ago', type: 'product' },
    { item: 'Training Registration', description: 'New course registration received', time: '2 days ago', type: 'training' },
  ],
}

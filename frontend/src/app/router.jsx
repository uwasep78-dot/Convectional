import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout.jsx'
import { AdminLayout } from './layouts/AdminLayout.jsx'
// Public
import Home from './features/home/Home.jsx'
import About from './features/about/About.jsx'
import ServicesOverview from './features/services/ServicesOverview.jsx'
import ServiceDetail from './features/services/ServiceDetail.jsx'
import Projects from './features/projects/Projects.jsx'
import ProjectDetail from './features/projects/ProjectDetail.jsx'
import Products from './features/products/Products.jsx'
import ProductDetail from './features/products/ProductDetail.jsx'
import Quotation from './features/quotations/Quotation.jsx'
import Training from './features/training/Training.jsx'
import CourseDetail from './features/training/CourseDetail.jsx'
import Contact from './features/contact/Contact.jsx'
import PrivacyPolicy from './features/legal/PrivacyPolicy.jsx'
import TermsOfUse from './features/legal/TermsOfUse.jsx'
import NotFound from './features/errors/NotFound.jsx'
// Smart features
import SolarCalculator from './features/calculator/SolarCalculator.jsx'
import FloatingChat from './features/chat/FloatingChat.jsx'
// Customer dashboard
import CustomerDashboard from './features/customer-dashboard/CustomerDashboard.jsx'
// Maintenance & equipment
import MaintenanceTracking from './features/maintenance/MaintenanceTracking.jsx'
import EquipmentRecord from './features/equipment/EquipmentRecord.jsx'
// Admin
import AdminDashboard from './features/admin/Dashboard.jsx'
import AdminServices from './features/admin/Services.jsx'
import AdminProducts from './features/admin/Products.jsx'
import AdminCategories from './features/admin/Categories.jsx'
import AdminProjects from './features/admin/Projects.jsx'
import AdminGallery from './features/admin/Gallery.jsx'
import AdminQuotations from './features/admin/Quotations.jsx'
import AdminMaintenance from './features/admin/Maintenance.jsx'
import AdminCourses from './features/admin/Courses.jsx'
import AdminRegistrations from './features/admin/Registrations.jsx'
import AdminEnquiries from './features/admin/Enquiries.jsx'
import AdminCustomers from './features/admin/Customers.jsx'
import AdminEquipment from './features/admin/Equipment.jsx'
import AdminNotifications from './features/admin/Notifications.jsx'
import AdminReports from './features/admin/Reports.jsx'
import AdminSettings from './features/admin/Settings.jsx'
import AdminContactSettings from './features/admin/ContactSettings.jsx'
import AdminSocialSettings from './features/admin/SocialSettings.jsx'
import AdminProfile from './features/admin/Profile.jsx'
import AdminAccount from './features/admin/Account.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'services', Component: ServicesOverview },
      { path: 'services/:serviceKey', Component: ServiceDetail },
      { path: 'projects', Component: Projects },
      { path: 'projects/:slug', Component: ProjectDetail },
      { path: 'products', Component: Products },
      { path: 'products/:slug', Component: ProductDetail },
      { path: 'quotation', Component: Quotation },
      { path: 'training', Component: Training },
      { path: 'training/courses/:slug', Component: CourseDetail },
      { path: 'contact', Component: Contact },
      { path: 'privacy-policy', Component: PrivacyPolicy },
      { path: 'terms-of-use', Component: TermsOfUse },
      { path: 'calculator', Component: SolarCalculator },
      { path: 'maintenance-request', Component: MaintenanceTracking },
      { path: 'equipment/:assetRef', Component: EquipmentRecord },
      { path: 'customer-dashboard', Component: CustomerDashboard },
      { path: '*', Component: NotFound },
    ],
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'services', Component: AdminServices },
      { path: 'products', Component: AdminProducts },
      { path: 'categories', Component: AdminCategories },
      { path: 'projects', Component: AdminProjects },
      { path: 'gallery', Component: AdminGallery },
      { path: 'quotations', Component: AdminQuotations },
      { path: 'maintenance', Component: AdminMaintenance },
      { path: 'courses', Component: AdminCourses },
      { path: 'registrations', Component: AdminRegistrations },
      { path: 'enquiries', Component: AdminEnquiries },
      { path: 'customers', Component: AdminCustomers },
      { path: 'equipment', Component: AdminEquipment },
      { path: 'notifications', Component: AdminNotifications },
      { path: 'reports', Component: AdminReports },
      { path: 'settings', Component: AdminSettings },
      { path: 'settings/contact', Component: AdminContactSettings },
      { path: 'settings/social', Component: AdminSocialSettings },
      { path: 'profile', Component: AdminProfile },
      { path: 'account', Component: AdminAccount },
    ],
  },
])

export default router

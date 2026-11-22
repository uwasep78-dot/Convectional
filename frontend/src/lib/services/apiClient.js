import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Request/response logging can be added here later.
export default apiClient

export const API_ENDPOINTS = {
  services: '/services',
  products: '/products',
  categories: '/categories',
  projects: '/projects',
  quotations: '/quotations',
  maintenance: '/maintenance-requests',
  courses: '/courses',
  registrations: '/registrations',
  enquiries: '/enquiries',
  customers: '/customers',
  equipment: '/equipment',
  notifications: '/notifications',
  settings: '/settings',
  contact: '/contact',
}

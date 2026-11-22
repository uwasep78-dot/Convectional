/* Mock API layer simulating future backend endpoints.
   All functions return promises and are clearly labelled as demo simulations.
   Replace these with real apiClient calls in the backend integration phase. */

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  async getServices() {
    await delay()
    return { data: [], error: null }
  },
  async getService(key) {
    await delay()
    return { data: null, error: null }
  },
  async getProducts({ category, search, sort } = {}) {
    await delay()
    return { data: [], error: null }
  },
  async getProduct(slug) {
    await delay()
    return { data: null, error: null }
  },
  async getProjects({ category } = {}) {
    await delay()
    return { data: [], error: null }
  },
  async getProject(slug) {
    await delay()
    return { data: null, error: null }
  },
  async getCourses() {
    await delay()
    return { data: [], error: null }
  },
  async getCourse(slug) {
    await delay()
    return { data: null, error: null }
  },
  async submitQuotation(payload) {
    await delay(800)
    return {
      data: { reference: 'QT-' + Math.floor(100000 + Math.random() * 900000), status: 'received' },
      error: null,
      demo: true,
    }
  },
  async submitContact(payload) {
    await delay(800)
    return { data: { received: true }, error: null, demo: true }
  },
  async submitMaintenanceRequest(payload) {
    await delay(800)
    return { data: { reference: 'MT-' + Math.floor(100000 + Math.random() * 900000), status: 'submitted' }, error: null, demo: true }
  },
  async submitTrainingRegistration(payload) {
    await delay(800)
    return { data: { received: true }, error: null, demo: true }
  },
}

export default mockApi

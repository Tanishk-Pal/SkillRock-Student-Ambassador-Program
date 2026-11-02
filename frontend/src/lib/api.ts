import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// Attach admin JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ssap_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally for admin routes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname
      if (path.startsWith('/admin') && path !== '/admin/login') {
        localStorage.removeItem('ssap_admin_token')
        localStorage.removeItem('ssap_admin_user')
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

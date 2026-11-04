import axios from 'axios'

// Fallback to live Render backend if VITE_API_URL is unset
const defaultApiUrl = 'https://skillrock-student-ambassador-program.onrender.com/api'
const baseURL = import.meta.env.VITE_API_URL || defaultApiUrl

const api = axios.create({
  baseURL,
  timeout: 45000, // 45s to safely handle Render free-tier cold starts
})

export const getUploadUrl = (filename: string) => {
  if (!filename) return ''
  if (filename.startsWith('http://') || filename.startsWith('https://')) return filename
  const backendBase = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/api\/?$/, '')
  return `${backendBase}/uploads/${filename}`
}

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

export const fetchLeaderboard = async (params: { page?: number; limit?: number; search?: string; college?: string; badge?: string } = {}) => {
  const query = new URLSearchParams()
  if (params.page) query.append('page', params.page.toString())
  if (params.limit) query.append('limit', params.limit.toString())
  if (params.search) query.append('search', params.search)
  if (params.college) query.append('college', params.college)
  if (params.badge) query.append('badge', params.badge)
  const res = await api.get(`/leaderboard?${query.toString()}`)
  return res.data
}

export const fetchLeaderboardStats = async () => {
  const res = await api.get('/leaderboard/stats')
  return res.data
}

export const fetchCertificateDetails = async (certId: string) => {
  const res = await api.get(`/certificates/verify/${encodeURIComponent(certId)}`)
  return res.data
}

export default api

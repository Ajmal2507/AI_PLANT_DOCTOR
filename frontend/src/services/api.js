import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const req = error.config
    if (error.response?.status === 401 && !req._retry) {
      req._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const res = await axios.post('/api/auth/token/refresh/', { refresh })
          const token = res.data.access
          localStorage.setItem('access_token', token)
          req.headers.Authorization = `Bearer ${token}`
          return api(req)
        } catch {
          localStorage.clear()
          window.location.href = '/auth'
        }
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register:      (data)     => api.post('/auth/register/', data),
  login:         (data)     => api.post('/auth/login/', data),
  logout:        (refresh)  => api.post('/auth/logout/', { refresh }),
  getProfile:    ()         => api.get('/auth/profile/'),
  updateProfile: (data)     => api.put('/auth/profile/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

export const detectionAPI = {
  analyzeImage: (file) => {
    const form = new FormData()
    form.append('image', file)
    return api.post('/detection/analyze/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const historyAPI = {
  getAll:     (params = {}) => api.get('/history/', { params }),
  getById:    (id)          => api.get(`/history/${id}/`),
  deleteById: (id)          => api.delete(`/history/${id}/delete/`),
}

export const reportsAPI = {
  downloadPDF: (id) => api.get(`/reports/${id}/pdf/`, { responseType: 'blob' }),
}

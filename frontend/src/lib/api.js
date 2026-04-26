import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
}

// Progress API
export const progressAPI = {
  getProgress: (userId) => api.get(`/api/progress/${userId}`),
  updateProgress: (data) => api.post('/api/progress/', data),
}

// Quiz API
export const quizAPI = {
  getQuestions: () => api.get('/api/quiz/questions'),
  submitAnswer: (data) => api.post('/api/quiz/submit', data),
  getResults: (userId) => api.get(`/api/quiz/results/${userId}`),
  getSummary: (userId) => api.get(`/api/quiz/summary/${userId}`),
}

export default api

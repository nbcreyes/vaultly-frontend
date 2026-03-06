import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

/**
 * Vaultly API Client
 *
 * Central Axios instance used for all API requests.
 *
 * Features:
 *   - Base URL from VITE_API_URL environment variable
 *   - Automatic Bearer token injection from auth store
 *   - 401 responses trigger automatic logout
 *   - Request/response interceptors for consistent error handling
 *   - Standardised error format returned to callers
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
})

/**
 * Request interceptor — attach auth token on every request
 */
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vaultly_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response interceptor — handle global error cases
 */
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status

    // 401 — token expired or invalid, force logout
    if (status === 401) {
      localStorage.removeItem('vaultly_token')
      localStorage.removeItem('vaultly_user')

      // Only redirect if not already on an auth page
      if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login'
      }
    }

    // Normalise the error so callers always get a consistent shape:
    // { message, errors, status }
    const normalisedError = {
      message: error.response?.data?.message || 'An unexpected error occurred.',
      errors:  error.response?.data?.errors  || {},
      status:  status || 0,
    }

    return Promise.reject(normalisedError)
  }
)

export default client
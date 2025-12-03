import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import router from '@/router'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const authStore = useAuthStore()
    
    // Get fresh access token from MSAL
    const token = await authStore.getAccessToken()
    
    // Add auth token to requests
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('[API] 401 Unauthorized - attempting token refresh')
      
      // Try to get a new token
      const token = await authStore.getAccessToken()
      
      if (!token) {
        // Token acquisition failed, logout user
        console.error('[API] Token refresh failed - logging out')
        authStore.logout()
        router.push('/login')
        notificationStore.error('Session expired. Please login again.')
        return Promise.reject(error)
      }
      
      // Retry the original request with new token
      const originalRequest = error.config
      originalRequest.headers.Authorization = `Bearer ${token}`
      return api(originalRequest)
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
    
    // Map error codes to user-friendly messages
    const errorCode = error.response?.data?.code
    const friendlyMessages: Record<string, string> = {
      AUTH_REQUIRED: 'Authentication required',
      AUTH_INVALID: 'Invalid authentication token',
      AUTH_INSUFFICIENT: 'You do not have permission to perform this action',
      VALIDATION_ERROR: 'Please check your input and try again',
      RISK_LOCKED: 'This risk is locked and cannot be edited',
      NOT_FOUND: 'The requested resource was not found',
      INTERNAL_ERROR: 'An internal error occurred. Please try again later',
    }

    const displayMessage = friendlyMessages[errorCode] || errorMessage

    // Show notification (except for 401 which is handled above)
    if (error.response?.status !== 401) {
      notificationStore.error(displayMessage)
    }

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        status: error.response?.status,
        code: errorCode,
        message: errorMessage,
        url: error.config?.url,
      })
    }

    return Promise.reject(error)
  }
)

export default api

import axios from 'axios'
import { toast } from 'react-toastify'
import store from '../store/store'
import { logout } from '../features/auth/auth.slice'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
  // Read from localStorage, not the store: the auth slice keeps it in sync.
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 without a token is a wrong login: the form shows it. With a token, the session ended.
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      store.dispatch(logout())
      // Fixed toastId: several requests can fail at once, show the message only once.
      toast.info('Tu sesión expiró, volvé a ingresar', { toastId: 'session-expired' })
    }
    return Promise.reject(error)
  }
)

export default api

import { toast } from 'react-toastify'
import api from './api'
import store from '../store/store'
import { logout } from '../features/auth/auth.slice'

const fetchData = async (pathname, params = {}, method = 'GET') => {
  const token = store.getState().auth.token
  const isGet = method.toUpperCase() === 'GET'

  try {
    const response = await api({
      url: pathname,
      method,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      params: isGet ? params : undefined,
      data: isGet ? undefined : params
    })
    return response.data
  } catch (error) {
    // A 401 without a token is a wrong login: the form shows it. With a token, the session ended.
    if (error.response?.status === 401 && token) {
      store.dispatch(logout())
      // Fixed toastId: several requests can fail at once, show the message only once.
      toast.info('Tu sesión expiró, volvé a ingresar', { toastId: 'session-expired' })
    }
    return Promise.reject(error)
  }
}

export default fetchData

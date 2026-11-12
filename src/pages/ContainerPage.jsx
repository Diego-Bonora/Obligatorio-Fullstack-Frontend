import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../api/api'
import { logout, setUser } from '../features/auth/auth.slice'
import { setCategories } from '../features/categories/categories.slice'
import { getErrorMessage } from '../utils/apiError'
import AppHeader from '../components/layout/AppHeader'
import BottomNav from '../components/layout/BottomNav'

const ContainerPage = () => {
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const user = useSelector(state => state.auth.user)
  const [userError, setUserError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    if (!token || user) return

    const loadUser = async () => {
      setUserError(null)
      try {
        const { data: me } = await api.get('/users/me')
        dispatch(setUser(me))
      } catch (error) {
        if (error.response?.status !== 401) setUserError(getErrorMessage(error))
      }
    }
    loadUser()
  }, [token, user, dispatch, reloadCount])

  useEffect(() => {
    if (!token) return

    const loadCategories = async () => {
      try {
        const { data: categories } = await api.get('/categories')
        dispatch(setCategories(categories))
      } catch (error) {
        if (error.response?.status !== 401) toast.error(getErrorMessage(error))
      }
    }
    loadCategories()
  }, [token, dispatch])

  const handleLogout = () => {
    dispatch(logout())
    toast.info('Sesión cerrada')
  }

  return (
    <div className="app-shell">
      <AppHeader user={user} onLogout={handleLogout} />

      <main className="container">
        {userError && (
          <div className="feed-error">
            <p className="error">{userError}</p>
            <button type="button" className="btn secondary" onClick={() => setReloadCount(prev => prev + 1)}>Reintentar</button>
          </div>
        )}
        <Outlet />
      </main>

      <BottomNav isAdmin={user?.role === 'admin'} onLogout={handleLogout} />
    </div>
  )
}

export default ContainerPage

import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../api/api'
import { logout, setUser } from '../features/auth/auth.slice'
import { setCategories } from '../features/categories/categories.slice'
import { getErrorMessage } from '../utils/apiError'
import Avatar from '../components/shared/Avatar'

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
    <>
      <header className="main-header">
        <div className="header-content">
          <Link to="/" className="app-logo">🍲 <span>Recetario</span></Link>
          <nav className="main-nav">
            <NavLink to="/" end>Inicio</NavLink>
            <NavLink to="/users" end>Usuarios</NavLink>
            <NavLink to="/profile">Mi perfil</NavLink>
            {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          </nav>
          <div className="header-user">
            {user && (
              <Link to="/profile" className="header-profile">
                <Avatar user={user} size="small" />
                <span className="header-username">{user.username}</span>
              </Link>
            )}
            <button type="button" className="btn secondary" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
      </header>

      <main className="container">
        {userError && (
          <div className="feed-error">
            <p className="error">{userError}</p>
            <button type="button" className="btn secondary" onClick={() => setReloadCount(prev => prev + 1)}>Reintentar</button>
          </div>
        )}
        <Outlet />
      </main>
    </>
  )
}

export default ContainerPage

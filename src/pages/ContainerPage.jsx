import { useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../api/api'
import { logout, setUser } from '../features/auth/auth.slice'
import { setCategories } from '../features/categories/categories.slice'
import { getErrorMessage } from '../utils/apiError'

const ContainerPage = () => {
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    if (!token || user) return

    const loadUser = async () => {
      try {
        const { data: me } = await api.get('/users/me')
        dispatch(setUser(me))
      } catch (error) {
        if (error.response?.status !== 401) toast.error(getErrorMessage(error))
      }
    }
    loadUser()
  }, [token, user, dispatch])

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
            <NavLink to="/profile">Perfil</NavLink>
            {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          </nav>
          <div className="header-user">
            {user && <span>{user.username}</span>}
            <button type="button" className="btn secondary" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </>
  )
}

export default ContainerPage

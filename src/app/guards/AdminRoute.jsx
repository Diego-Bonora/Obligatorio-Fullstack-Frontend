import { Outlet, Navigate } from 'react-router'
import { useSelector } from 'react-redux'

const AdminRoute = () => {
  const user = useSelector(state => state.auth.user)

  // After a reload the user is still being fetched: wait instead of sending an admin away.
  if (!user) {
    return <p className="loading">Cargando...</p>
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" />
  }

  return <Outlet />
}

export default AdminRoute

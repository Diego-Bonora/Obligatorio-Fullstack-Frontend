import { Outlet, Navigate } from 'react-router'
import { useSelector } from 'react-redux'

const ProtectedRoute = () => {
  const token = useSelector(state => state.auth.token)

  if (!token) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}

export default ProtectedRoute

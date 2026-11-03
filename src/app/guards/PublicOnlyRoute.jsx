import { Outlet, Navigate } from 'react-router'
import { useSelector } from 'react-redux'

const PublicOnlyRoute = () => {
  const token = useSelector(state => state.auth.token)

  if (token) {
    return <Navigate to="/" />
  }

  return <Outlet />
}

export default PublicOnlyRoute

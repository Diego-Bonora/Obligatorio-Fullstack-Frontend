import { Outlet, Navigate } from 'react-router'
import { useSelector } from 'react-redux'

const PublicOnlyRoute = () => {
  const token = useSelector(state => state.auth.token)
  const isNewUser = useSelector(state => state.auth.isNewUser)

  // This guard decides where to go after login/register: the forms don't navigate themselves,
  // because the redux update renders before the router's navigation (it runs in a transition).
  if (token) {
    return <Navigate to={isNewUser ? '/welcome' : '/'} replace />
  }

  return <Outlet />
}

export default PublicOnlyRoute

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import FollowButton from '../../components/shared/FollowButton'
import UserRecipes from '../../components/profile/UserRecipes'

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    const loadUser = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get(`/users/${userId}`)
        if (!ignore) setUser(data)
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadUser()

    return () => { ignore = true }
  }, [userId, reloadCount])

  if (loading) return <p className="loading">Cargando perfil...</p>

  if (error) {
    return (
      <div className="feed-error">
        <p className="error">{error}</p>
        <button type="button" className="btn secondary" onClick={() => setReloadCount(prev => prev + 1)}>Reintentar</button>
      </div>
    )
  }

  return (
    <section>
      <header className="profile-header">
        <span className="avatar large">
          {user.profilePicture
            ? <img src={user.profilePicture} alt="" />
            : user.username[0].toUpperCase()}
        </span>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <FollowButton userId={user._id} />
        </div>
      </header>
      <UserRecipes userId={user._id} />
    </section>
  )
}

const UserProfilePage = () => {
  const { id } = useParams()
  const currentUserId = useSelector(state => state.auth.user?._id)

  if (id === currentUserId) return <Navigate to="/profile" replace />

  // the key gives each profile fresh state, so page and data never carry over between users
  return <UserProfile key={id} userId={id} />
}

export default UserProfilePage

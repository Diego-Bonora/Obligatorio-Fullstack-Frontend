import { useEffect, useState } from 'react'
import { useStore } from 'react-redux'
import { Link } from 'react-router'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import Avatar from '../shared/Avatar'
import FollowButton from '../shared/FollowButton'

// There's no "suggested users" endpoint: shows the first users from the users list.
// excludeFollowed hides the ones already followed when the list loads (not after,
// so a "Seguir" click shows "Siguiendo" instead of making the row disappear).
const SuggestedCooks = ({ currentUserId, max = 5, excludeFollowed = false, emptyMessage }) => {
  const store = useStore()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    const loadUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get('/users', { params: { page: 1 } })
        if (ignore) return
        const following = excludeFollowed ? (store.getState().auth.user?.following ?? []) : []
        const others = data.data.filter(user => user._id !== currentUserId && !following.includes(user._id))
        setUsers(others.slice(0, max))
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadUsers()

    return () => { ignore = true }
  }, [currentUserId, max, excludeFollowed, store, reloadCount])

  if (loading) return <p className="loading">Buscando cocineros...</p>

  if (error) {
    return (
      <div className="feed-error">
        <p className="error">{error}</p>
        <button type="button" className="btn secondary" onClick={() => setReloadCount(prev => prev + 1)}>Reintentar</button>
      </div>
    )
  }

  if (users.length === 0) {
    return <p className="muted">{emptyMessage ?? 'Todavía no hay otros cocineros. ¡Sé de los primeros en compartir recetas!'}</p>
  }

  return (
    <ul className="suggested-list">
      {users.map(user => (
        <li key={user._id} className="suggested-item">
          <Avatar user={user} />
          <Link to={`/users/${user._id}`} className="suggested-name">@{user.username}</Link>
          <FollowButton userId={user._id} className="pill" followingLabel="Siguiendo" />
        </li>
      ))}
    </ul>
  )
}

export default SuggestedCooks

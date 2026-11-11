import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import Modal from '../shared/Modal'

const FollowingList = ({ ids }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    const loadUsers = async () => {
      setLoading(true)
      setError(null)
      const results = await Promise.allSettled(ids.map(id => api.get(`/users/${id}`)))
      if (ignore) return

      const failure = results.find(result => result.status === 'rejected' && result.reason.response?.status !== 404)
      if (failure) {
        setError(getErrorMessage(failure.reason))
      } else {
        setUsers(results.filter(result => result.status === 'fulfilled').map(result => result.value.data))
      }
      setLoading(false)
    }
    loadUsers()

    return () => { ignore = true }
  }, [ids, reloadCount])

  if (loading) return <p className="loading">Cargando seguidos...</p>

  if (error) {
    return (
      <div className="feed-error">
        <p className="error">{error}</p>
        <button type="button" className="btn secondary" onClick={() => setReloadCount(prev => prev + 1)}>Reintentar</button>
      </div>
    )
  }

  if (ids.length === 0) return <p className="loading">Todavía no seguís a nadie.</p>

  const unavailable = ids.length - users.length

  return (
    <>
      {users.length > 0 && (
        <ul className="following-list">
          {users.map(user => (
            <li key={user._id} className="following-item">
              <span className="avatar small">
                {user.profilePicture
                  ? <img src={user.profilePicture} alt="" />
                  : user.username[0].toUpperCase()}
              </span>
              <Link to={`/users/${user._id}`} className="user-link">
                @{user.username}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {unavailable > 0 && (
        <p className="muted small">
          {unavailable === 1 ? '1 cuenta seguida ya no está disponible.' : `${unavailable} cuentas seguidas ya no están disponibles.`}
        </p>
      )}
    </>
  )
}

const Following = () => {
  const following = useSelector(state => state.auth.user.following)
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="btn link following-trigger" onClick={() => setOpen(true)}>
        <strong>{following.length}</strong> seguidos
      </button>

      {open && (
        <Modal title="Seguidos" onClose={() => setOpen(false)}>
          <FollowingList ids={following} />
          <div className="following-actions">
            <Link to="/users" className="btn primary">Buscar usuarios</Link>
          </div>
        </Modal>
      )}
    </>
  )
}

export default Following

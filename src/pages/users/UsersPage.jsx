import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import Pagination from '../../components/shared/Pagination'
import FollowButton from '../../components/shared/FollowButton'

const UsersPage = () => {
  const currentUser = useSelector(state => state.auth.user)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    const loadUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = { page }
        if (search) params.search = search
        const { data } = await api.get('/users', { params })
        if (ignore) return
        setUsers(data.data)
        setMeta(data.meta)
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadUsers()

    return () => { ignore = true }
  }, [search, page, reloadCount])

  const handleSearch = (event) => {
    event.preventDefault()
    setSearch(draft.trim())
    setPage(1)
  }

  return (
    <section className="admin-section">
      <div className="section-header">
        <h2>Usuarios{meta && ` (${meta.total})`}</h2>
      </div>

      <form className="ingredient-search" onSubmit={handleSearch}>
        <input type="search" placeholder="Buscar por usuario" aria-label="Buscar por usuario" value={draft} onChange={event => setDraft(event.target.value)} />
        <button type="submit" className="btn secondary">Buscar</button>
      </form>

      {loading && <p className="loading">Cargando usuarios...</p>}

      {error && (
        <div className="feed-error">
          <p className="error">{error}</p>
          <button type="button" className="btn secondary" onClick={() => setReloadCount(prev => prev + 1)}>Reintentar</button>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <p className="loading">{search ? `No encontramos usuarios para "${search}".` : 'No hay usuarios para mostrar.'}</p>
      )}

      {!error && (
        <ul className="category-list">
          {users.map(user => (
            <li key={user._id} className="card category-item">
              <Link to={`/users/${user._id}`} className="following-item user-link">
                <span className="avatar small">
                  {user.profilePicture
                    ? <img src={user.profilePicture} alt="" />
                    : user.username[0].toUpperCase()}
                </span>
                <span>@{user.username}</span>
              </Link>
              <div className="category-actions">
                {user._id === currentUser?._id
                  ? <span className="muted">Tu cuenta</span>
                  : <FollowButton userId={user._id} />}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!error && <Pagination meta={meta} onPageChange={setPage} />}
    </section>
  )
}

export default UsersPage

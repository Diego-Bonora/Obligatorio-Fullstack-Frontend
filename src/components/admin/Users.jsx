import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import Pagination from '../shared/Pagination'

const roleLabels = { user: 'Usuario', admin: 'Administrador' }

const Users = () => {
  const currentUserId = useSelector(state => state.auth.user?._id)
  const [plan, setPlan] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)
  const [busyId, setBusyId] = useState(null)
  const [confirmingId, setConfirmingId] = useState(null)

  useEffect(() => {
    let ignore = false

    const loadUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = { page }
        if (plan) params.plan = plan
        if (role) params.role = role
        const { data } = await api.get('/admin/users', { params })
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
  }, [plan, role, page, reloadCount])

  const handleFilterChange = (setFilter) => (event) => {
    setFilter(event.target.value)
    setPage(1)
    setConfirmingId(null)
  }

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    setConfirmingId(null)
  }

  const changeStatus = async (id, active) => {
    setBusyId(id)
    try {
      const { data } = await api.patch(`/admin/users/${id}/status`, { active })
      setUsers(prev => prev.map(user => (user._id === id ? data : user)))
      setConfirmingId(null)
      toast.success(active ? 'Usuario activado' : 'Usuario desactivado')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const renderActions = (user) => {
    if (user._id === currentUserId) return <span className="muted">Tu cuenta</span>

    const busy = busyId === user._id

    if (!user.active) {
      return <button type="button" className="btn secondary" disabled={busy} onClick={() => changeStatus(user._id, true)}>Activar</button>
    }

    if (confirmingId === user._id) {
      return (
        <div className="confirm-inline">
          <span>¿Desactivar? Su sesión se cierra al instante.</span>
          <button type="button" className="btn danger" disabled={busy} onClick={() => changeStatus(user._id, false)}>Sí</button>
          <button type="button" className="btn secondary" disabled={busy} onClick={() => setConfirmingId(null)}>No</button>
        </div>
      )
    }

    return <button type="button" className="btn danger" disabled={busy} onClick={() => setConfirmingId(user._id)}>Desactivar cuenta</button>
  }

  return (
    <section className="admin-section">
      <div className="section-header">
        <h2>Usuarios{meta && ` (${meta.total})`}</h2>
        <div className="filters">
          <select value={plan} onChange={handleFilterChange(setPlan)} aria-label="Filtrar por plan">
            <option value="">Todos los planes</option>
            <option value="plus">Plus</option>
            <option value="premium">Premium</option>
          </select>
          <select value={role} onChange={handleFilterChange(setRole)} aria-label="Filtrar por rol">
            <option value="">Todos los roles</option>
            <option value="user">Usuarios</option>
            <option value="admin">Administradores</option>
          </select>
        </div>
      </div>

      {loading && <p className="loading">Cargando usuarios...</p>}

      {error && (
        <div className="feed-error">
          <p className="error">{error}</p>
          <button type="button" className="btn secondary" onClick={() => setReloadCount(prev => prev + 1)}>Reintentar</button>
        </div>
      )}

      {!loading && !error && users.length === 0 && <p className="loading">No hay usuarios para mostrar.</p>}

      {!error && (
        <ul className="category-list">
          {users.map(user => (
            <li key={user._id} className="card category-item">
              <div>
                <h3>@{user.username}</h3>
                <p>{user.email}</p>
                <span className="category-status">
                  Plan {user.plan} · {roleLabels[user.role] ?? user.role} · {user.recipesCount} {user.recipesCount === 1 ? 'receta' : 'recetas'} · {user.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="category-actions">{renderActions(user)}</div>
            </li>
          ))}
        </ul>
      )}

      {!error && <Pagination meta={meta} onPageChange={handlePageChange} />}
    </section>
  )
}

export default Users

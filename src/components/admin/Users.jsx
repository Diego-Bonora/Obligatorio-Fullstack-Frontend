import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import Pagination from '../shared/Pagination'
import Avatar from '../shared/Avatar'
import FilterChip from '../shared/FilterChip'

const roleLabels = { user: 'Usuario', admin: 'Administrador' }
const planLabels = { plus: 'Plus', premium: 'Premium' }
const planOptions = [{ value: 'plus', label: 'Plus' }, { value: 'premium', label: 'Premium' }]
const roleOptions = [{ value: 'user', label: 'Usuarios' }, { value: 'admin', label: 'Administradores' }]

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
  const [successMessage, setSuccessMessage] = useState(null)

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

  const handleFilterChange = (setFilter) => (value) => {
    setFilter(value)
    setPage(1)
    setConfirmingId(null)
  }

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    setConfirmingId(null)
  }

  const changeStatus = async (id, active) => {
    setBusyId(id)
    setSuccessMessage(null)
    try {
      const { data } = await api.patch(`/admin/users/${id}/status`, { active })
      setUsers(prev => prev.map(user => (user._id === id ? data : user)))
      setConfirmingId(null)
      setSuccessMessage(active ? 'Usuario activado' : 'Usuario desactivado')
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
      <div className="admin-section-header">
        <h2>Usuarios{meta && <span className="count">{meta.total}</span>}</h2>
      </div>
      <div className="admin-toolbar">
        <FilterChip label="Plan" options={planOptions} value={plan} onChange={handleFilterChange(setPlan)} />
        <FilterChip label="Rol" options={roleOptions} value={role} onChange={handleFilterChange(setRole)} />
      </div>

      {successMessage && <p className="notice">{successMessage}</p>}

      {loading && <p className="loading">Cargando usuarios...</p>}

      {error && (
        <div className="feed-error">
          <p className="error">{error}</p>
          <button type="button" className="btn secondary" onClick={() => setReloadCount(prev => prev + 1)}>Reintentar</button>
        </div>
      )}

      {!loading && !error && users.length === 0 && <p className="loading">No hay usuarios para mostrar.</p>}

      {!error && !loading && users.length > 0 && (
        <ul className="admin-list">
          {users.map(user => (
            <li key={user._id} className={`admin-item${user.active ? '' : ' inactive'}`}>
              <Avatar user={user} />
              <div className="admin-item-info">
                <h3>@{user.username}</h3>
                <p className="muted">{user.email} · <span className="nowrap">{user.recipesCount} {user.recipesCount === 1 ? 'receta' : 'recetas'}</span></p>
                <div className="badges">
                  <span className={`badge ${user.plan === 'premium' ? 'success' : ''}`}>{planLabels[user.plan] ?? user.plan}</span>
                  {user.role === 'admin' && <span className="badge dark">{roleLabels.admin}</span>}
                  <span className={`badge ${user.active ? 'success' : 'danger'}`}>{user.active ? 'Activo' : 'Inactivo'}</span>
                </div>
              </div>
              <div className="admin-item-actions">{renderActions(user)}</div>
            </li>
          ))}
        </ul>
      )}

      {!error && <Pagination meta={meta} onPageChange={handlePageChange} />}
    </section>
  )
}

export default Users

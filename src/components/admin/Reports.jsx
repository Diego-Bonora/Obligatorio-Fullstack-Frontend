import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import { formatRelativeDate } from '../../utils/date'
import Pagination from '../shared/Pagination'

const reasonLabels = {
  spam: 'Spam',
  inappropriate_content: 'Contenido inapropiado',
  other: 'Otro'
}

const statusLabels = {
  pending: 'Pendiente',
  reviewed: 'Receta dada de baja',
  dismissed: 'Descartado'
}

const Reports = () => {
    const [status, setStatus] = useState('pending')
    const [page, setPage] = useState(1)
    const [reports, setReports] = useState([])
    const [meta, setMeta] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [reloadCount, setReloadCount] = useState(0)
    const [busyId, setBusyId] = useState(null)
    const [confirmingId, setConfirmingId] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    let ignore = false

    const loadReports = async () => {
        setLoading(true)
        setError(null)
        try {
            const params = status ? { status, page } : { page }
            const { data } = await api.get('/admin/reports', { params })
            if (ignore) return
            setReports(data.data)
            setMeta(data.meta)
        } catch (err) {
            if (!ignore) setError(getErrorMessage(err))
        } finally {
            if (!ignore) setLoading(false)
        }
    }
    loadReports()

    return () => { ignore = true }
  }, [status, page, reloadCount])

  const reload = () => setReloadCount(prev => prev + 1)

  const handleStatusChange = (event) => {
    setStatus(event.target.value)
    setPage(1)
    setConfirmingId(null)
  }

  const resolveReport = async (id, action) => {
    setBusyId(id)
    setSuccessMessage(null)
    try {
      await api.patch(`/admin/reports/${id}/resolve`, { action })
      setSuccessMessage(action === 'takedown' ? 'Receta dada de baja' : 'Reporte descartado')
      setConfirmingId(null)
      if (status === 'pending' && reports.length === 1 && page > 1) setPage(page - 1)
      else reload()
    } catch (err) {
      toast.error(getErrorMessage(err))
      if (err.response?.status === 409) reload()
    } finally {
      setBusyId(null)
    }
  }

  const renderActions = (report) => {
    const busy = busyId === report._id

    if (report.status !== 'pending') return <span className="muted">Resuelto</span>

    if (confirmingId === report._id) {
      return (
        <div className="confirm-inline">
          <span>¿Está seguro que desea eliminarla?</span>
          <button type="button" className="btn danger" disabled={busy} onClick={() => resolveReport(report._id, 'takedown')}>Sí</button>
          <button type="button" className="btn secondary" disabled={busy} onClick={() => setConfirmingId(null)}>No</button>
        </div>
      )
    }

    return (
      <>
        <button type="button" className="btn danger" disabled={busy} onClick={() => setConfirmingId(report._id)}>Eliminar receta</button>
        <button type="button" className="btn secondary" disabled={busy} onClick={() => resolveReport(report._id, 'dismiss')}>Descartar</button>
      </>
    )
  }

  return (
    <section className="admin-section">
      <div className="section-header">
        <h2>Recetas reportadas</h2>
        <div className="filters">
          <select value={status} onChange={handleStatusChange} aria-label="Filtrar por estado">
            <option value="pending">Pendientes</option>
            <option value="reviewed">Recetas dadas de baja</option>
            <option value="dismissed">Descartados</option>
            <option value="">Todos</option>
          </select>
        </div>
      </div>

      {successMessage && <p className="notice">{successMessage}</p>}

      {loading && <p className="loading">Cargando reportes...</p>}

      {error && (
        <div className="feed-error">
          <p className="error">{error}</p>
          <button type="button" className="btn secondary" onClick={reload}>Reintentar</button>
        </div>
      )}

      {!loading && !error && reports.length === 0 && <p className="loading">No hay reportes para mostrar.</p>}

      {!error && (
        <ul className="category-list">
          {reports.map(report => (
            <li key={report._id} className="card category-item">
              <div>
                <h3>
                  {report.recipe
                    ? <Link to={`/recipes/${report.recipe._id}`}>{report.recipe.title}</Link>
                    : <span className="muted">Receta no disponible</span>}
                </h3>
                <p>{reasonLabels[report.reason] ?? report.reason} · @{report.reportedBy?.username ?? 'usuario'} · {formatRelativeDate(report.createdAt)}</p>
                {report.details && <p>{report.details}</p>}
                <span className="category-status">{statusLabels[report.status] ?? report.status}</span>
              </div>
              <div className="category-actions">{renderActions(report)}</div>
            </li>
          ))}
        </ul>
      )}

      {!error && <Pagination meta={meta} onPageChange={setPage} />}
    </section>
  )
}

export default Reports

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { setUser } from '../../features/auth/auth.slice'
import { getErrorMessage } from '../../utils/apiError'

const ChangePlan = () => {
  const dispatch = useDispatch()
  const plan = useSelector(state => state.auth.user?.plan)
  const [confirming, setConfirming] = useState(false)
  const [changing, setChanging] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  if (successMessage) {
    return (
      <div className="card">
        <p className="notice">{successMessage}</p>
      </div>
    )
  }

  if (plan !== 'plus') return null

  const upgrade = async () => {
    setChanging(true)
    try {
      const { data: me } = await api.patch('/users/me/plan')
      dispatch(setUser(me))
      setSuccessMessage('¡Ya tenés plan premium!')
    } catch (error) {
      toast.error(getErrorMessage(error))
      setChanging(false)
    }
  }

  return (
    <div className="card">
      <p className="stat-label">Pasate a premium</p>
      <p>Publicá recetas sin límite y pedí sustituciones de ingredientes.</p>
      {confirming
        ? (
          <div className="confirm-inline">
            <span>¿Cambiar a premium?</span>
            <button type="button" className="btn primary" disabled={changing} onClick={upgrade}>Sí</button>
            <button type="button" className="btn secondary" disabled={changing} onClick={() => setConfirming(false)}>No</button>
          </div>
        )
        : <button type="button" className="btn primary" onClick={() => setConfirming(true)}>Cambiar a premium</button>}
    </div>
  )
}

export default ChangePlan

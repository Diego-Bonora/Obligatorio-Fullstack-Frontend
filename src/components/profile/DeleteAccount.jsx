import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { logout } from '../../features/auth/auth.slice'
import { getErrorMessage } from '../../utils/apiError'

const DeleteAccount = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!user || user.role === 'admin') return null

  const deleteAccount = async () => {
    setDeleting(true)
    try {
      await api.delete('/users/me')
      dispatch(logout())
      toast.info('Tu cuenta fue eliminada')
    } catch (error) {
      toast.error(getErrorMessage(error))
      setDeleting(false)
    }
  }

  return (
    <div className="delete-account">
      {confirming
        ? (
          <div className="confirm-inline">
            <span>¿Eliminar tu cuenta? No vas a poder volver a ingresar.</span>
            <button type="button" className="btn danger" disabled={deleting} onClick={deleteAccount}>Sí</button>
            <button type="button" className="btn secondary" disabled={deleting} onClick={() => setConfirming(false)}>No</button>
          </div>
        )
        : <button type="button" className="btn danger" onClick={() => setConfirming(true)}>Eliminar mi cuenta</button>}
    </div>
  )
}

export default DeleteAccount

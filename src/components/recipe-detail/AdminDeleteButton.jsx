import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { setPendingMessage } from '../../features/messages/messages.slice'
import { getErrorMessage } from '../../utils/apiError'

const AdminDeleteButton = ({ recipeId, onDeleted }) => {
  const dispatch = useDispatch()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const deleteRecipe = async () => {
    setDeleting(true)
    try {
      const { data } = await api.delete(`/recipes/${recipeId}`)
      dispatch(setPendingMessage(data.message))
      onDeleted()
    } catch (error) {
      toast.error(getErrorMessage(error))
      setDeleting(false)
    }
  }

  if (!confirming) {
    return <button type="button" className="btn danger" onClick={() => setConfirming(true)}>Eliminar receta</button>
  }

  return (
    <div className="confirm-inline">
      <span>¿Eliminar esta receta?</span>
      <button type="button" className="btn danger" disabled={deleting} onClick={deleteRecipe}>Sí</button>
      <button type="button" className="btn secondary" disabled={deleting} onClick={() => setConfirming(false)}>No</button>
    </div>
  )
}

export default AdminDeleteButton

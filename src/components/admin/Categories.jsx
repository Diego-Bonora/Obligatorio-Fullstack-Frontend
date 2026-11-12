import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { setCategories } from '../../features/categories/categories.slice'
import { getErrorMessage } from '../../utils/apiError'
import Modal from '../shared/Modal'
import { PencilIcon, PlusIcon, PowerIcon, TagIcon } from '../shared/Icons'
import CategoryForm from './CategoryForm'

const Categories = () => {
  const dispatch = useDispatch()
  const categories = useSelector(state => state.categories.list)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const closeModal = useCallback(() => {
    setModal(null)
    setSaving(false)
  }, [])

  const reloadCategories = async () => {
    try {
      const { data } = await api.get('/categories')
      dispatch(setCategories(data))
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleSaved = async () => {
    const isEdit = Boolean(modal.category)
    closeModal()
    toast.success(isEdit ? 'Categoría actualizada' : 'Categoría creada')
    await reloadCategories()
  }

  const toggleActive = async (category) => {
    setBusyId(category._id)
    try {
      await api.patch(`/categories/${category._id}`, { active: !category.active })
      toast.success(category.active ? 'Categoría desactivada' : 'Categoría activada')
      await reloadCategories()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBusyId(null)
    }
  }

  const askDelete = async (id) => {
    setBusyId(id)
    try {
      const { data } = await api.get(`/categories/${id}/usage`)
      setDeleting({ id, recipesCount: data.recipesCount })
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBusyId(null)
    }
  }

  const deleteCategory = async (id) => {
    setBusyId(id)
    try {
      await api.delete(`/categories/${id}`)
      toast.success('Categoría eliminada')
      setDeleting(null)
      await reloadCategories()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBusyId(null)
    }
  }

  const renderActions = (category) => {
    const busy = busyId === category._id

    if (deleting?.id !== category._id) {
      return (
        <>
          <button type="button" className="btn secondary" disabled={busy} onClick={() => setModal({ category })}><PencilIcon />Editar</button>
          <button type="button" className="btn secondary" disabled={busy} onClick={() => toggleActive(category)}>
            <PowerIcon />{category.active ? 'Desactivar' : 'Activar'}
          </button>
          <button type="button" className="btn danger" disabled={busy} onClick={() => askDelete(category._id)}>Eliminar</button>
        </>
      )
    }

    if (deleting.recipesCount > 0) {
      return (
        <div className="confirm-inline">
          <span>No se puede eliminar: tiene {deleting.recipesCount} {deleting.recipesCount === 1 ? 'receta activa' : 'recetas activas'}.</span>
          <button type="button" className="btn secondary" onClick={() => setDeleting(null)}>Entendido</button>
        </div>
      )
    }

    return (
      <div className="confirm-inline">
        <span>¿Eliminar esta categoría?</span>
        <button type="button" className="btn danger" disabled={busy} onClick={() => deleteCategory(category._id)}>Sí</button>
        <button type="button" className="btn secondary" disabled={busy} onClick={() => setDeleting(null)}>No</button>
      </div>
    )
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h2>Categorías{categories.length > 0 && <span className="count">{categories.length}</span>}</h2>
        <button type="button" className="btn primary" onClick={() => setModal({ category: null })}>
          <PlusIcon size={18} />Nueva categoría
        </button>
      </div>

      {categories.length === 0 && <p className="loading">No hay categorías para mostrar.</p>}
      <ul className="admin-list">
        {categories.map(category => (
          <li key={category._id} className={`admin-item${category.active ? '' : ' inactive'}`}>
            <span className="admin-item-icon tone-mint"><TagIcon size={20} className="" /></span>
            <div className="admin-item-info">
              <h3>{category.name}</h3>
              {category.description && <p className="muted">{category.description}</p>}
              <div className="badges">
                <span className={`badge ${category.active ? 'success' : ''}`}>{category.active ? 'Activa' : 'Inactiva'}</span>
              </div>
            </div>
            <div className="admin-item-actions category-actions">{renderActions(category)}</div>
          </li>
        ))}
      </ul>

      {modal && (
        <Modal title={modal.category ? 'Editar categoría' : 'Crear nueva categoría'} onClose={saving ? undefined : closeModal}>
          <CategoryForm category={modal.category} onSaved={handleSaved} onCancel={closeModal} onBusyChange={setSaving} />
        </Modal>
      )}
    </section>
  )
}

export default Categories

import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import { setUser } from '../../features/auth/auth.slice'
import RecipeCard from '../shared/RecipeCard'
import RecipeForm from './RecipeForm'
import Modal from '../shared/Modal'
import Pagination from '../shared/Pagination'

const PLUS_RECIPE_LIMIT = 4

const MyRecipes = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const categories = useSelector(state => state.categories.list)
  const userId = user?._id
  // the cards show the author's name, so a profile edit has to reload them
  const username = user?.username

  const [recipes, setRecipes] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ category: '', difficulty: '' })
  const [reloadKey, setReloadKey] = useState(0)
  const [loading, setLoading] = useState(true)
  // null = closed, { recipe: null } = create, { recipe } = edit
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const reachedLimit = user?.plan === 'plus' && user.recipesCount >= PLUS_RECIPE_LIMIT

  useEffect(() => {
    if (!userId) return
    let ignore = false

    const loadRecipes = async () => {
      setLoading(true)
      const activeFilters = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
      try {
        const { data } = await api.get('/recipes', { params: { author: userId, page, limit: 5, ...activeFilters } })
        // a slower answer for an older filter or page must not replace the current one
        if (ignore) return
        setRecipes(data.data)
        setMeta(data.meta)
      } catch (error) {
        if (!ignore) toast.error(getErrorMessage(error))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadRecipes()

    return () => { ignore = true }
  }, [userId, username, page, filters, reloadKey])

  const refreshUser = async () => {
    try {
      const { data: me } = await api.get('/users/me')
      dispatch(setUser(me))
    } catch (error) {
      console.error('Error al actualizar el usuario:', error)
    }
  }

  const closeModal = useCallback(() => setModal(null), [])

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    setFilters(prev => ({ ...prev, [name]: value }))
    setPage(1)
  }

  const handleSaved = (saved) => {
    const isEdit = Boolean(modal.recipe)
    setModal(null)
    setSaving(false)

    if (isEdit) {
      // the PATCH answer has the author id only, so keep the populated author already shown
      setRecipes(prev => prev.map(recipe => recipe._id === saved._id ? { ...saved, author: recipe.author } : recipe))
      return
    }
    setPage(1)
    setReloadKey(prev => prev + 1)
    refreshUser()
  }

  const deleteRecipe = async (id) => {
    setDeleting(true)
    try {
      const { data } = await api.delete(`/recipes/${id}`)
      toast.success(data.message)
      setDeletingId(null)
      if (recipes.length === 1 && page > 1) setPage(page - 1)
      else setReloadKey(prev => prev + 1)
      await refreshUser()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  const getCategoryName = (id) => categories.find(category => category._id === id)?.name

  return (
    <section className="recipe-list">
      <div className="section-header">
        <h2>Mis recetas</h2>
        <button type="button" className="btn primary" disabled={!user || reachedLimit} onClick={() => setModal({ recipe: null })}>
          + Nueva receta
        </button>
      </div>
      {reachedLimit && (
        <p className="notice">Llegaste al límite de {PLUS_RECIPE_LIMIT} recetas del plan plus. Pasate a premium para publicar sin límite.</p>
      )}

      <div className="filters">
        <select name="category" value={filters.category} onChange={handleFilterChange} aria-label="Filtrar por categoría">
          <option value="">Todas las categorías</option>
          {categories.filter(category => category.active).map(category => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
        <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange} aria-label="Filtrar por dificultad">
          <option value="">Todas las dificultades</option>
          <option value="easy">Fácil</option>
          <option value="medium">Media</option>
          <option value="hard">Difícil</option>
        </select>
      </div>

      {loading && <p className="loading">Cargando recetas...</p>}
      {!loading && recipes.length === 0 && <p className="loading">No hay recetas para mostrar.</p>}
      {!loading && recipes.map(recipe => (
        <RecipeCard key={recipe._id} recipe={recipe} categoryName={getCategoryName(recipe.category)}>
          {deletingId === recipe._id
            ? (
              <div className="confirm-inline">
                <span>¿Eliminar esta receta?</span>
                <button type="button" className="btn danger" disabled={deleting} onClick={() => deleteRecipe(recipe._id)}>Sí</button>
                <button type="button" className="btn secondary" disabled={deleting} onClick={() => setDeletingId(null)}>No</button>
              </div>
            )
            : (
              <>
                <button type="button" className="btn secondary" onClick={() => setModal({ recipe })}>Editar</button>
                <button type="button" className="btn secondary" onClick={() => setDeletingId(recipe._id)}>Eliminar</button>
              </>
            )}
        </RecipeCard>
      ))}

      <Pagination meta={meta} onPageChange={setPage} />

      {modal && (
        <Modal title={modal.recipe ? 'Editar receta' : 'Nueva receta'} onClose={saving ? undefined : closeModal}>
          <RecipeForm recipe={modal.recipe} onSaved={handleSaved} onCancel={closeModal} onBusyChange={setSaving} />
        </Modal>
      )}
    </section>
  )
}

export default MyRecipes

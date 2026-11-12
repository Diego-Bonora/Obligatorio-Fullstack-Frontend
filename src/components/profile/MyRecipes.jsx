import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import { setUser } from '../../features/auth/auth.slice'
import { PLUS_RECIPE_LIMIT } from '../../utils/plans'
import { categoryOptions, difficultyOptions } from '../../utils/filters'
import CompactRecipeCard from '../shared/CompactRecipeCard'
import FilterChip from '../shared/FilterChip'
import RecipeForm from './RecipeForm'
import Modal from '../shared/Modal'
import Pagination from '../shared/Pagination'
import { PlusIcon, PotIcon } from '../shared/Icons'

const PAGE_SIZE = 6

const MyRecipes = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const categories = useSelector(state => state.categories.list)
  const userId = user?._id

  const [recipes, setRecipes] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ category: '', difficulty: '' })
  const [reloadKey, setReloadKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // recipe being edited (creating now lives in /recipes/new)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingRecipe, setDeletingRecipe] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const reachedLimit = user?.plan === 'plus' && user.recipesCount >= PLUS_RECIPE_LIMIT
  const hasFilters = Boolean(filters.category || filters.difficulty)

  useEffect(() => {
    if (!userId) return
    let ignore = false

    const loadRecipes = async () => {
      setLoading(true)
      setError(null)
      const activeFilters = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
      try {
        const { data } = await api.get('/recipes', { params: { author: userId, page, limit: PAGE_SIZE, ...activeFilters } })
        // a slower answer for an older filter or page must not replace the current one
        if (ignore) return
        setRecipes(data.data)
        setMeta(data.meta)
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadRecipes()

    return () => { ignore = true }
  }, [userId, page, filters, reloadKey])

  const refreshUser = async () => {
    try {
      const { data: me } = await api.get('/users/me')
      dispatch(setUser(me))
    } catch (err) {
      console.error('Error al actualizar el usuario:', err)
    }
  }

  const closeEdit = useCallback(() => setEditing(null), [])

  const changeFilter = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }))
    setPage(1)
  }

  const handleSaved = (saved) => {
    setEditing(null)
    setSaving(false)
    // the PATCH answer has the author id only, so keep the populated author already shown
    setRecipes(prev => prev.map(recipe => recipe._id === saved._id ? { ...saved, author: recipe.author } : recipe))
  }

  const deleteRecipe = async () => {
    setDeleting(true)
    try {
      const { data } = await api.delete(`/recipes/${deletingRecipe._id}`)
      toast.success(data.message)
      setDeletingRecipe(null)
      if (recipes.length === 1 && page > 1) setPage(page - 1)
      else setReloadKey(prev => prev + 1)
      await refreshUser()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const getCategoryName = (id) => categories.find(category => category._id === id)?.name

  return (
    <section className="profile-recipes">
      <h2>Mis recetas</h2>

      <div className="profile-recipes-toolbar">
        <FilterChip label="Categoría" options={categoryOptions(categories)} value={filters.category} onChange={value => changeFilter('category', value)} />
        <FilterChip label="Dificultad" options={difficultyOptions} value={filters.difficulty} onChange={value => changeFilter('difficulty', value)} />
        <span className="filters-spacer" />
        {reachedLimit
          ? <button type="button" className="btn primary" disabled><PlusIcon size={18} />Nueva receta</button>
          : <Link to="/recipes/new" className="btn primary"><PlusIcon size={18} />Nueva receta</Link>}
      </div>

      {reachedLimit && (
        <p className="notice">Llegaste al límite de {PLUS_RECIPE_LIMIT} recetas del plan Plus. Pasate a premium para publicar sin límite.</p>
      )}

      {loading && <p className="loading">Cargando recetas...</p>}

      {error && (
        <div className="feed-error">
          <p className="error">{error}</p>
          <button type="button" className="btn secondary" onClick={() => setReloadKey(prev => prev + 1)}>Reintentar</button>
        </div>
      )}

      {!loading && !error && recipes.length === 0 && (
        hasFilters
          ? <p className="loading">No hay recetas con esos filtros.</p>
          : (
            <div className="empty-state profile-empty">
              <span className="profile-empty-icon tone-butter"><PotIcon size={42} strokeWidth={1.6} className="" /></span>
              <h3>Todavía no publicaste recetas</h3>
              <p>Compartí tu primera receta con la comunidad.</p>
              {!reachedLimit && <Link to="/recipes/new" className="btn primary"><PlusIcon size={18} />Crear mi primera receta</Link>}
            </div>
          )
      )}

      {!loading && !error && recipes.length > 0 && (
        <div className="compact-grid">
          {recipes.map(recipe => (
            <CompactRecipeCard
              key={recipe._id}
              recipe={recipe}
              categoryName={getCategoryName(recipe.category)}
              onEdit={setEditing}
              onDelete={setDeletingRecipe}
            />
          ))}
        </div>
      )}

      {!error && <Pagination meta={meta} onPageChange={setPage} />}

      {editing && (
        <Modal title="Editar receta" onClose={saving ? undefined : closeEdit}>
          <RecipeForm recipe={editing} onSaved={handleSaved} onCancel={closeEdit} onBusyChange={setSaving} />
        </Modal>
      )}

      {deletingRecipe && (
        <Modal title="Eliminar receta" onClose={deleting ? undefined : () => setDeletingRecipe(null)}>
          <p>¿Eliminar <strong>{deletingRecipe.title}</strong>? No se puede deshacer.</p>
          <div className="form-actions">
            <button type="button" className="btn secondary" disabled={deleting} onClick={() => setDeletingRecipe(null)}>Cancelar</button>
            <button type="button" className="btn danger" disabled={deleting} onClick={deleteRecipe}>
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </Modal>
      )}
    </section>
  )
}

export default MyRecipes

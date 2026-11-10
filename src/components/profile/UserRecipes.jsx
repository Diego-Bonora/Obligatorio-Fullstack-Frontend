import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import RecipeCard from '../shared/RecipeCard'
import Pagination from '../shared/Pagination'

const UserRecipes = ({ userId }) => {
  const categories = useSelector(state => state.categories.list)
  const [recipes, setRecipes] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    const loadRecipes = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get('/recipes', { params: { author: userId, page, limit: 5 } })
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
  }, [userId, page, reloadCount])

  const getCategoryName = (id) => categories.find(category => category._id === id)?.name

  return (
    <section className="recipe-list">
      <div className="section-header">
        <h2>Recetas</h2>
      </div>

      {loading && <p className="loading">Cargando recetas...</p>}

      {error && (
        <div className="feed-error">
          <p className="error">{error}</p>
          <button type="button" className="btn secondary" onClick={() => setReloadCount(prev => prev + 1)}>Reintentar</button>
        </div>
      )}

      {!loading && !error && recipes.length === 0 && <p className="loading">No hay recetas para mostrar.</p>}

      {!loading && !error && recipes.map(recipe => (
        <RecipeCard key={recipe._id} recipe={recipe} categoryName={getCategoryName(recipe.category)} />
      ))}

      {!error && <Pagination meta={meta} onPageChange={setPage} />}
    </section>
  )
}

export default UserRecipes

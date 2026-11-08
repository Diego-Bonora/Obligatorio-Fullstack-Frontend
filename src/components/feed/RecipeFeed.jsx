import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import RecipeCard from '../shared/RecipeCard'

// Infinite list for one set of filters. The parent gives it a `key` built from the
// filters, so changing them mounts a fresh list (empty, page 1) instead of resetting by hand.
const RecipeFeed = ({ filters }) => {
  const categories = useSelector(state => state.categories.list)
  const [recipes, setRecipes] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  // starts true so the scroll observer isn't created before page 1 arrives
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const sentinelRef = useRef(null)

  useEffect(() => {
    let ignore = false

    const loadRecipes = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get('/recipes', { params: { ...filters, page, limit: 10 } })
        if (ignore) return
        // a recipe published while scrolling shifts the pages, so skip ones already shown
        setRecipes(prev => {
          const shownIds = new Set(prev.map(recipe => recipe._id))
          return [...prev, ...data.data.filter(recipe => !shownIds.has(recipe._id))]
        })
        setHasMore(page < data.meta.totalPages)
      } catch (err) {
        // keep hasMore: a failed page is not the end of the list, the user can retry it
        if (!ignore) setError(getErrorMessage(err))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadRecipes()

    return () => { ignore = true }
  }, [filters, page, retryCount])

  useEffect(() => {
    if (loading || error || !hasMore) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPage(prev => prev + 1)
    }, { rootMargin: '300px' })
    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [loading, error, hasMore])

  const getCategoryName = (id) => categories.find(category => category._id === id)?.name
  const emptyMessage = filters.feed === 'following'
    ? 'Todavía no seguís a nadie, o las personas que seguís no publicaron recetas.'
    : 'No hay recetas con esos filtros.'

  return (
    <>
      {recipes.map(recipe => (
        <RecipeCard key={recipe._id} recipe={recipe} categoryName={getCategoryName(recipe.category)} />
      ))}
      <div ref={sentinelRef} />
      {loading && <p className="loading">Cargando recetas...</p>}
      {error && (
        <div className="feed-error">
          <p className="error">{error}</p>
          <button type="button" className="btn secondary" onClick={() => setRetryCount(prev => prev + 1)}>Reintentar</button>
        </div>
      )}
      {!loading && !error && !hasMore && recipes.length === 0 && <p className="loading">{emptyMessage}</p>}
      {!loading && !error && !hasMore && recipes.length > 0 && <p className="loading">No hay más recetas.</p>}
    </>
  )
}

export default RecipeFeed

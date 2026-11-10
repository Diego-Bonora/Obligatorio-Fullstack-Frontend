import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { clearPendingMessage } from '../../features/messages/messages.slice'
import { ingredientSearchSchema } from '../../validators/feed.validators'
import RecipeFeed from '../../components/feed/RecipeFeed'

const tabs = [
  { value: 'recent', label: 'Recientes' },
  { value: 'following', label: 'Siguiendo' },
  { value: 'popular', label: 'Populares' }
]

const FILTER_KEYS = ['category', 'difficulty', 'maxTime', 'ingredient']

// The API answers 400 to any unknown or invalid query key, so links with extra
// params (e.g. ?fbclid=... added by social apps) would break the feed.
const pickFilters = (params) => {
  const filters = { feed: tabs.some(tab => tab.value === params.get('feed')) ? params.get('feed') : 'recent' }
  const category = params.get('category')
  const difficulty = params.get('difficulty')
  const maxTime = params.get('maxTime')
  const ingredient = params.get('ingredient')?.trim()

  if (/^[a-f0-9]{24}$/.test(category)) filters.category = category
  if (['easy', 'medium', 'hard'].includes(difficulty)) filters.difficulty = difficulty
  if (['15', '30', '60'].includes(maxTime)) filters.maxTime = maxTime
  if (ingredient && ingredient.length <= 50) filters.ingredient = ingredient
  return filters
}

const IngredientSearch = ({ defaultValue, onSearch }) => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: joiResolver(ingredientSearchSchema),
    mode: 'onChange',
    defaultValues: { ingredient: defaultValue }
  })

  return (
    <form className="ingredient-search" onSubmit={handleSubmit(({ ingredient }) => onSearch(ingredient))}>
      <input type="search" placeholder="Buscar por ingrediente" aria-label="Buscar por ingrediente" {...register('ingredient')} />
      <button type="submit" className="btn secondary" disabled={!isValid}>Buscar</button>
      {errors.ingredient && <span className="error">{errors.ingredient.message}</span>}
    </form>
  )
}

const FeedPage = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const categories = useSelector(state => state.categories.list)
  const pendingMessage = useSelector(state => state.messages.pending)
  const [successMessage, setSuccessMessage] = useState(pendingMessage)

  useEffect(() => {
    dispatch(clearPendingMessage())
  }, [dispatch])

  const query = searchParams.toString()

  // one stable object per URL, so the feed's effect doesn't re-run on every render
  const filters = useMemo(() => pickFilters(new URLSearchParams(query)), [query])
  const filtersKey = JSON.stringify(filters)

  const updateParam = (name, value) => {
    setSuccessMessage(null)
    const next = new URLSearchParams(searchParams)
    if (value) next.set(name, value)
    else next.delete(name)
    if (next.get('feed') === 'recent') next.delete('feed')
    setSearchParams(next)
  }

  const clearFilters = () => {
    setSuccessMessage(null)
    const next = new URLSearchParams(searchParams)
    FILTER_KEYS.forEach(key => next.delete(key))
    setSearchParams(next)
  }

  const hasFilters = FILTER_KEYS.some(key => filters[key])

  return (
    <section className="recipe-list">
      <h1>Inicio</h1>
      {successMessage && <p className="notice">{successMessage}</p>}

      <div className="tabs" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={filters.feed === tab.value}
            className={`tab ${filters.feed === tab.value ? 'active' : ''}`}
            onClick={() => updateParam('feed', tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="feed-filters">
        <IngredientSearch key={filters.ingredient ?? ''} defaultValue={filters.ingredient ?? ''} onSearch={value => updateParam('ingredient', value)} />
        <div className="filters">
          <select value={filters.category ?? ''} onChange={event => updateParam('category', event.target.value)} aria-label="Filtrar por categoría">
            <option value="">Todas las categorías</option>
            {categories.filter(category => category.active).map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <select value={filters.difficulty ?? ''} onChange={event => updateParam('difficulty', event.target.value)} aria-label="Filtrar por dificultad">
            <option value="">Todas las dificultades</option>
            <option value="easy">Fácil</option>
            <option value="medium">Media</option>
            <option value="hard">Difícil</option>
          </select>
          <select value={filters.maxTime ?? ''} onChange={event => updateParam('maxTime', event.target.value)} aria-label="Filtrar por tiempo">
            <option value="">Cualquier tiempo</option>
            <option value="15">Hasta 15 min</option>
            <option value="30">Hasta 30 min</option>
            <option value="60">Hasta 1 hora</option>
          </select>
          {hasFilters && <button type="button" className="btn link" onClick={clearFilters}>Limpiar filtros</button>}
        </div>
      </div>

      <RecipeFeed key={filtersKey} filters={filters} />
    </section>
  )
}

export default FeedPage

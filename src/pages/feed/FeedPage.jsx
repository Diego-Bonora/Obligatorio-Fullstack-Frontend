import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { clearPendingMessage } from '../../features/messages/messages.slice'
import RecipeFeed from '../../components/feed/RecipeFeed'
import FeedFilters from '../../components/feed/FeedFilters'
import FeedSidebar from '../../components/feed/FeedSidebar'
import Avatar from '../../components/shared/Avatar'

const tabs = [
  { value: 'recent', label: 'Recientes' },
  { value: 'following', label: 'Siguiendo' },
  { value: 'popular', label: 'Populares' }
]

const FILTER_KEYS = ['category', 'difficulty', 'maxTime', 'ingredient', 'tags']

// The API answers 400 to any unknown or invalid query key, so links with extra
// params (e.g. ?fbclid=... added by social apps) would break the feed.
const pickFilters = (params) => {
  const filters = { feed: tabs.some(tab => tab.value === params.get('feed')) ? params.get('feed') : 'recent' }
  const category = params.get('category')
  const difficulty = params.get('difficulty')
  const maxTime = params.get('maxTime')
  const ingredient = params.get('ingredient')?.trim()
  const tags = params.get('tags')?.trim()

  if (/^[a-f0-9]{24}$/.test(category)) filters.category = category
  if (['easy', 'medium', 'hard'].includes(difficulty)) filters.difficulty = difficulty
  if (['15', '30', '60'].includes(maxTime)) filters.maxTime = maxTime
  if (ingredient && ingredient.length <= 50) filters.ingredient = ingredient
  if (tags && tags.length <= 200) filters.tags = tags
  return filters
}

const FeedComposer = ({ user }) => (
  <div className="feed-composer">
    <Avatar user={user} />
    <Link to="/recipes/new" className="feed-composer-prompt">
      ¿Qué cocinaste hoy{user ? `, ${user.username}` : ''}?
    </Link>
    <Link to="/recipes/new" className="btn soft feed-composer-button">Publicar receta</Link>
  </div>
)

const FeedPage = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const user = useSelector(state => state.auth.user)
  const pendingMessage = useSelector(state => state.messages.pending)
  // fixed toastId: StrictMode runs the effect twice before the clear lands
  useEffect(() => {
    if (!pendingMessage) return
    toast.success(pendingMessage, { toastId: 'pending-message' })
    dispatch(clearPendingMessage())
  }, [pendingMessage, dispatch])

  const query = searchParams.toString()

  // one stable object per URL, so the feed's effect doesn't re-run on every render
  const filters = useMemo(() => pickFilters(new URLSearchParams(query)), [query])
  const filtersKey = JSON.stringify(filters)

  const updateParam = (name, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(name, value)
    else next.delete(name)
    if (next.get('feed') === 'recent') next.delete('feed')
    setSearchParams(next)
  }

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams)
    FILTER_KEYS.forEach(key => next.delete(key))
    setSearchParams(next)
  }

  return (
    <div className="feed-layout">
      <section className="feed-main">
        <h1 className="visually-hidden">Inicio</h1>

        <FeedComposer user={user} />

        <div className="segmented" role="tablist" aria-label="Qué recetas ver">
          {tabs.map(tab => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={filters.feed === tab.value}
              className="segmented-option"
              onClick={() => updateParam('feed', tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <FeedFilters filters={filters} onChange={updateParam} onClear={clearFilters} />

        <RecipeFeed key={filtersKey} filters={filters} />
      </section>

      <FeedSidebar activeIngredient={filters.ingredient} onIngredient={value => updateParam('ingredient', value)} />
    </div>
  )
}

export default FeedPage

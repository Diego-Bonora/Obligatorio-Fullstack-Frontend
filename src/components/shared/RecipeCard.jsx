import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { formatRelativeDate } from '../../utils/date'
import { difficultyLabels } from '../../utils/labels'
import Avatar from './Avatar'
import Dropdown from './Dropdown'
import FollowButton from './FollowButton'
import RecipeImage from './RecipeImage'
import { ClockIcon, DotsIcon, HeartOutlineIcon, LinkIcon } from './Icons'

const copyLink = async (recipeId) => {
  try {
    await navigator.clipboard.writeText(`${window.location.origin}/recipes/${recipeId}`)
    toast.success('Enlace copiado')
  } catch {
    toast.error('No se pudo copiar el enlace')
  }
}

// Feed card. The recipe list doesn't say if I liked each recipe (only the detail does),
// so the card shows the likes count and the like button lives in the recipe page.
const RecipeCard = ({ recipe, categoryName }) => {
  const currentUser = useSelector(state => state.auth.user)
  const { _id, title, description, prepTime, difficulty, likesCount, tags = [], author, createdAt } = recipe
  const recipeUrl = `/recipes/${_id}`

  const isOwn = author?._id === currentUser?._id
  const showFollow = Boolean(author?._id) && Boolean(currentUser) && !isOwn && !currentUser.following.includes(author._id)

  return (
    <article className="feed-card">
      <header className="feed-card-header">
        {author?._id
          ? <Link to={`/users/${author._id}`} className="feed-card-avatar" tabIndex={-1} aria-hidden="true"><Avatar user={author} /></Link>
          : <Avatar user={author} />}
        <div className="feed-card-author">
          {author?._id
            ? <Link to={`/users/${author._id}`} className="feed-card-username">@{author.username}</Link>
            : <span className="feed-card-username">@usuario</span>}
          <span className="feed-card-date">{formatRelativeDate(createdAt)}</span>
        </div>
        {showFollow && <FollowButton userId={author._id} className="follow-soft" />}
        <Dropdown
          align="right"
          triggerClassName="icon-button"
          triggerLabel={`Más opciones de ${title}`}
          panelClassName="menu"
          trigger={<DotsIcon size={22} className="" />}
        >
          {close => (
            <>
              <Link to={recipeUrl} className="menu-item" onClick={close}>Ver receta</Link>
              <button type="button" className="menu-item" onClick={() => { close(); copyLink(_id) }}>
                <LinkIcon size={18} className="" />Copiar enlace
              </button>
            </>
          )}
        </Dropdown>
      </header>

      <Link to={recipeUrl} className="feed-card-image" tabIndex={-1} aria-hidden="true">
        <RecipeImage recipe={recipe} categoryName={categoryName} />
      </Link>

      <div className="feed-card-body">
        <h3><Link to={recipeUrl}>{title}</Link></h3>
        {description && <p className="feed-card-description">{description}</p>}
        <div className="feed-card-meta">
          <span className="feed-card-time"><ClockIcon size={16} className="" />{prepTime} min</span>
          <span className="difficulty-badge">{difficultyLabels[difficulty]}</span>
        </div>
        {tags.length > 0 && (
          <ul className="tag-links">
            {tags.map(tag => (
              <li key={tag}><Link to={`/?tags=${encodeURIComponent(tag)}`}>#{tag}</Link></li>
            ))}
          </ul>
        )}
      </div>

      <footer className="feed-card-actions">
        <Link to={recipeUrl} className="feed-card-action" aria-label={`${likesCount} me gusta. Ver receta para dar me gusta`}>
          <HeartOutlineIcon size={22} className="" />
          <span aria-hidden="true">{likesCount}</span>
        </Link>
      </footer>
    </article>
  )
}

export default RecipeCard

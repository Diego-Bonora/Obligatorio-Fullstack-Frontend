import { Link } from 'react-router'
import { formatRelativeDate } from '../../utils/date'
import { difficultyLabels } from '../../utils/labels'

const RecipeCard = ({ recipe, categoryName, children }) => {
  const { _id, title, description, imageUrl, prepTime, difficulty, likesCount, tags = [], author, createdAt } = recipe
  const username = author?.username ?? 'usuario'

  return (
    <article className="card recipe-card">
      <header className="recipe-card-header">
        <span className="avatar">{username[0].toUpperCase()}</span>
        <div>
          <strong>@{username}</strong>
          <span className="recipe-date"> · {formatRelativeDate(createdAt)}</span>
        </div>
      </header>

      {categoryName && <span className="recipe-category">{categoryName}</span>}
      <h3><Link to={`/recipes/${_id}`}>{title}</Link></h3>
      {description && <p className="recipe-description">{description}</p>}

      {imageUrl && (
        <Link to={`/recipes/${_id}`}>
          <img className="recipe-card-image" src={imageUrl} alt={title} />
        </Link>
      )}

      {tags.length > 0 && (
        <ul className="tags">
          {tags.map(tag => <li key={tag} className="tag">#{tag}</li>)}
        </ul>
      )}

      <footer className="recipe-meta">
        <span>♥ {likesCount}</span>
        <span>⏱ {prepTime} min</span>
        <span>{difficultyLabels[difficulty]}</span>
      </footer>

      {children && <div className="recipe-card-actions">{children}</div>}
    </article>
  )
}

export default RecipeCard

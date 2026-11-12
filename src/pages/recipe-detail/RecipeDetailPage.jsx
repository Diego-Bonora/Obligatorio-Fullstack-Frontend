import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import { formatRelativeDate } from '../../utils/date'
import { difficultyLabels } from '../../utils/labels'
import LikeButton from '../../components/recipe-detail/LikeButton'
import ReportButton from '../../components/recipe-detail/ReportButton'
import AdminDeleteButton from '../../components/recipe-detail/AdminDeleteButton'
import Substitutions from '../../components/recipe-detail/Substitutions'
import Comments from '../../components/recipe-detail/Comments'
import AuthorLink from '../../components/shared/AuthorLink'
import { ClockIcon, UsersIcon } from '../../components/shared/Icons'

const RecipeDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const userId = useSelector(state => state.auth.user?._id)
  const isAdmin = useSelector(state => state.auth.user?.role === 'admin')
  const categories = useSelector(state => state.categories.list)
  const [recipe, setRecipe] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    const loadRecipe = async () => {
      setRecipe(null)
      setError(null)
      try {
        const { data } = await api.get(`/recipes/${id}`)
        if (!ignore) setRecipe(data)
      } catch (err) {
        if (ignore) return
        setError(err.response?.status === 404 || err.response?.status === 400
          ? 'La receta no existe o fue eliminada.'
          : getErrorMessage(err))
      }
    }
    loadRecipe()

    return () => { ignore = true }
  }, [id])

  // a link opened in a new tab has no history inside the app, so "back" would leave it
  const goBack = () => (location.key === 'default' ? navigate('/') : navigate(-1))

  if (error) {
    return (
      <section className="recipe-list">
        <div className="card">
          <p>{error}</p>
          <Link to="/" className="btn primary">Ir al inicio</Link>
        </div>
      </section>
    )
  }
  if (!recipe) return <p className="loading">Cargando receta...</p>

  const isOwner = Boolean(userId) && recipe.author?._id === userId
  const categoryName = categories.find(category => category._id === recipe.category)?.name
  const handleLikeChange = (likedByMe, likesCount) => setRecipe(prev => ({ ...prev, likedByMe, likesCount }))

  return (
    <section className="recipe-list">
      <button type="button" className="btn link" onClick={goBack}>← Volver</button>

      <article className="card recipe-detail">
        <header className="recipe-card-header">
          <AuthorLink author={recipe.author} />
          <span className="recipe-date">{formatRelativeDate(recipe.createdAt)}</span>
        </header>

        {categoryName && <span className="recipe-category">{categoryName}</span>}
        <h1>{recipe.title}</h1>
        {recipe.description && <p>{recipe.description}</p>}
        {recipe.imageUrl && <img className="recipe-detail-image" src={recipe.imageUrl} alt={recipe.title} />}

        <div className="recipe-meta">
          <span><ClockIcon size={16} className="" />{recipe.prepTime} min</span>
          <span><UsersIcon size={16} className="" />{recipe.servings} {recipe.servings === 1 ? 'porción' : 'porciones'}</span>
          <span>{difficultyLabels[recipe.difficulty]}</span>
        </div>

        {recipe.tags.length > 0 && (
          <ul className="tags">
            {recipe.tags.map(tag => <li key={tag} className="tag">#{tag}</li>)}
          </ul>
        )}

        <div className="recipe-card-actions">
          <LikeButton recipeId={recipe._id} liked={Boolean(recipe.likedByMe)} count={recipe.likesCount} onChange={handleLikeChange} />
          {!isOwner && <ReportButton recipeId={recipe._id} />}
          {isAdmin && !isOwner && <AdminDeleteButton recipeId={recipe._id} onDeleted={() => navigate('/', { replace: true })} />}
        </div>
      </article>

      {recipe.nutrition?.calories != null && (
        <section className="card detail-section">
          <h2>Información nutricional</h2>
          <dl className="nutrition">
            <div><dt>Calorías</dt><dd>{recipe.nutrition.calories} kcal</dd></div>
            <div><dt>Proteínas</dt><dd>{recipe.nutrition.protein} g</dd></div>
            <div><dt>Grasas</dt><dd>{recipe.nutrition.fat} g</dd></div>
            <div><dt>Carbohidratos</dt><dd>{recipe.nutrition.carbs} g</dd></div>
          </dl>
          <p className="muted small">Estimación de Spoonacular para la receta completa.</p>
        </section>
      )}

      <section className="card detail-section">
        <h2>Ingredientes</h2>
        <ul className="ingredient-list">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}><strong>{ingredient.quantity}</strong> {ingredient.name}</li>
          ))}
        </ul>
      </section>

      <section className="card detail-section">
        <h2>Preparación</h2>
        <ol className="step-list">
          {recipe.steps.map((step, index) => (
            <li key={index}>
              <span className="step-number">{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <Substitutions recipeId={recipe._id} />
      <Comments key={recipe._id} recipeId={recipe._id} />
    </section>
  )
}

export default RecipeDetailPage

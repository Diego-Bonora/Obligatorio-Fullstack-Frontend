import { useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../api/api'
import { setUser } from '../../features/auth/auth.slice'
import { PLUS_RECIPE_LIMIT } from '../../utils/plans'
import RecipeForm from '../../components/profile/RecipeForm'

// Before this page, recipes could only be created from "Mis recetas". Now the
// header, the bottom navigation and the feed box all link here.
const NewRecipePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(state => state.auth.user)

  const goBack = useCallback(() => (location.key === 'default' ? navigate('/') : navigate(-1)), [location.key, navigate])
  const ignoreBusy = useCallback(() => {}, [])

  const handleSaved = async (recipe) => {
    // recipesCount changed: the plan usage depends on it
    try {
      const { data: me } = await api.get('/users/me')
      dispatch(setUser(me))
    } catch (error) {
      console.error('Error al actualizar el usuario:', error)
    }
    navigate(`/recipes/${recipe._id}`, { replace: true })
  }

  if (!user) return <p className="loading">Cargando...</p>

  const reachedLimit = user.plan === 'plus' && user.recipesCount >= PLUS_RECIPE_LIMIT

  return (
    <section className="page-narrow">
      <header className="page-header">
        <h1>Nueva receta</h1>
        <p className="muted">Compartí tu receta con la comunidad.</p>
      </header>

      {reachedLimit
        ? (
          <div className="card empty-state">
            <p>Llegaste al límite de {PLUS_RECIPE_LIMIT} recetas del plan Plus.</p>
            <p>Pasate a premium para publicar sin límite.</p>
            <Link to="/profile" className="btn primary">Ver mi plan</Link>
          </div>
        )
        : (
          <div className="card">
            <RecipeForm recipe={null} onSaved={handleSaved} onCancel={goBack} onBusyChange={ignoreBusy} />
          </div>
        )}
    </section>
  )
}

export default NewRecipePage

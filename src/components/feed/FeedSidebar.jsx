import { useSelector } from 'react-redux'
import PlanCard from '../profile/PlanCard'
import SuggestedCooks from '../welcome/SuggestedCooks'

// Fixed list in the frontend: the API has no "popular ingredients".
const SUGGESTED_INGREDIENTS = ['huevos', 'pollo', 'zapallo', 'avena', 'dulce de leche', 'lentejas']

// Desktop only (hidden on mobile with CSS).
const FeedSidebar = ({ activeIngredient, onIngredient }) => {
  const userId = useSelector(state => state.auth.user?._id)

  return (
    <aside className="feed-sidebar" aria-label="Más opciones">
      <PlanCard variant="sidebar" />

      {userId && (
        <section className="side-card">
          <h2>Usuarios para seguir</h2>
          <SuggestedCooks
            currentUserId={userId}
            max={3}
            excludeFollowed
            emptyMessage="Ya seguís a todos los cocineros de la lista."
          />
        </section>
      )}

      <section className="side-card">
        <h2>Buscá por ingrediente</h2>
        <div className="ingredient-chips">
          {SUGGESTED_INGREDIENTS.map(ingredient => (
            <button
              key={ingredient}
              type="button"
              className="ingredient-chip"
              aria-pressed={activeIngredient === ingredient}
              onClick={() => onIngredient(activeIngredient === ingredient ? '' : ingredient)}
            >
              {ingredient}
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}

export default FeedSidebar

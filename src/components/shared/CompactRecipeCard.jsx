import { Link } from 'react-router'
import { difficultyLabels } from '../../utils/labels'
import Dropdown from './Dropdown'
import RecipeImage from './RecipeImage'
import { ClockIcon, DotsIcon, HeartIcon, PencilIcon, TrashIcon } from './Icons'

// Card for the profile grids. onEdit/onDelete add a "⋯" menu (only on my own recipes).
const CompactRecipeCard = ({ recipe, categoryName, onEdit, onDelete }) => {
  const { _id, title, prepTime, difficulty, likesCount } = recipe

  return (
    <article className="compact-card">
      <Link to={`/recipes/${_id}`} className="compact-card-link">
        <RecipeImage recipe={recipe} categoryName={categoryName} size="medium" iconSize={52} />
        <div className="compact-card-body">
          <h3>{title}</h3>
          <div className="compact-card-meta">
            <span className="compact-card-time"><ClockIcon size={14} className="" />{prepTime} min</span>
            <span>{difficultyLabels[difficulty]}</span>
            <span className="compact-card-likes" aria-label={`${likesCount} me gusta`}>
              <HeartIcon size={14} className="" /><span aria-hidden="true">{likesCount}</span>
            </span>
          </div>
        </div>
      </Link>

      {(onEdit || onDelete) && (
        <div className="compact-card-menu">
          <Dropdown
            align="right"
            triggerClassName="icon-button"
            triggerLabel={`Opciones de ${title}`}
            panelClassName="menu"
            trigger={<DotsIcon size={20} className="" />}
          >
            {close => (
              <>
                {onEdit && (
                  <button type="button" className="menu-item" onClick={() => { close(); onEdit(recipe) }}>
                    <PencilIcon size={18} className="" />Editar
                  </button>
                )}
                {onDelete && (
                  <button type="button" className="menu-item danger" onClick={() => { close(); onDelete(recipe) }}>
                    <TrashIcon size={18} className="" />Eliminar
                  </button>
                )}
              </>
            )}
          </Dropdown>
        </div>
      )}
    </article>
  )
}

export default CompactRecipeCard

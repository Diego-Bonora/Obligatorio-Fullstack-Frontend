import { CakeIcon, LeafIcon, PotIcon } from './Icons'

const TILES = [
  { tone: 'butter', Icon: PotIcon },
  { tone: 'mint', Icon: LeafIcon },
  { tone: 'peach', Icon: CakeIcon },
  { tone: 'rose', Icon: PotIcon }
]

// Same recipe, same color: derived from the id instead of random.
const pickTile = (id = '') => {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return TILES[hash % TILES.length]
}

// The recipe photo, or a colored block with an icon while it doesn't have one.
const RecipeImage = ({ recipe, categoryName, size = 'large', iconSize = 72 }) => {
  const { Icon, tone } = pickTile(recipe._id)

  return (
    <div className={`recipe-image ${size}${recipe.imageUrl ? '' : ` tone-${tone}`}`}>
      {recipe.imageUrl
        ? <img src={recipe.imageUrl} alt="" loading="lazy" />
        : <Icon size={iconSize} strokeWidth={1.4} className="" />}
      {categoryName && <span className="recipe-image-badge">{categoryName}</span>}
    </div>
  )
}

export default RecipeImage

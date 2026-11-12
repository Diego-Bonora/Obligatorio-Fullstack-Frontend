import { useState } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { PLUS_RECIPE_LIMIT } from '../../utils/plans'
import ProfileHeader from '../../components/profile/ProfileHeader'
import Following from '../../components/profile/Following'
import Edit from '../../components/profile/Edit'
import MyRecipes from '../../components/profile/MyRecipes'
import PlanCard from '../../components/profile/PlanCard'
import Modal from '../../components/shared/Modal'
import { GearIcon } from '../../components/shared/Icons'

// Mobile only: a compact strip instead of the plan card. Opens the full card.
const PlanStrip = ({ user }) => {
  const [open, setOpen] = useState(false)
  if (user.role === 'admin') return null

  const isPremium = user.plan === 'premium'
  const percent = Math.min(100, Math.round((user.recipesCount / PLUS_RECIPE_LIMIT) * 100))

  return (
    <>
      <button type="button" className="plan-strip" onClick={() => setOpen(true)}>
        <span className="plan-strip-info">
          <strong>
            {isPremium
              ? `Plan Premium · ${user.recipesCount} ${user.recipesCount === 1 ? 'receta' : 'recetas'}`
              : `Plan Plus · ${user.recipesCount} de ${PLUS_RECIPE_LIMIT} recetas`}
          </strong>
          {!isPremium && <span className="plan-strip-bar" aria-hidden="true"><span style={{ width: `${Math.max(percent, 2)}%` }} /></span>}
        </span>
        {!isPremium && <span className="plan-strip-cta">Premium ›</span>}
      </button>
      {open && (
        <Modal title="Tu plan" onClose={() => setOpen(false)}>
          <PlanCard />
        </Modal>
      )}
    </>
  )
}

const ProfilePage = () => {
  const user = useSelector(state => state.auth.user)

  if (!user) return <p className="loading">Cargando perfil...</p>

  return (
    <div className="profile-page">
      <ProfileHeader
        user={user}
        showSettings
        actions={<Edit />}
        counters={(
          <>
            <span className="profile-counter static">
              <b>{user.recipesCount}</b>
              <span>{user.recipesCount === 1 ? 'receta' : 'recetas'}</span>
            </span>
            <Following />
          </>
        )}
      />

      <PlanStrip user={user} />

      <div className="profile-layout">
        <MyRecipes />

        <aside className="profile-sidebar">
          <PlanCard />
          <Link to="/settings" className="side-card side-link">
            <GearIcon size={20} className="" />Configuración de la cuenta
          </Link>
        </aside>
      </div>
    </div>
  )
}

export default ProfilePage

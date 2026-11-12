import { Link } from 'react-router'
import { toast } from 'react-toastify'
import Avatar from '../shared/Avatar'
import { CakeIcon, GearIcon, LeafIcon, PotIcon, ShareIcon } from '../shared/Icons'

const shareProfile = async (userId) => {
  try {
    await navigator.clipboard.writeText(`${window.location.origin}/users/${userId}`)
    toast.success('Enlace del perfil copiado')
  } catch {
    toast.error('No se pudo copiar el enlace')
  }
}

// Shared by "Mi perfil" and other users' profiles.
// counters: React nodes (only my own profile has the data); actions: buttons on the right.
const ProfileHeader = ({ user, counters, actions, showSettings = false }) => (
  <section className="profile-hero">
    {/* decorative cover: there are no cover photos in the API */}
    <div className="profile-cover" aria-hidden="true">
      <PotIcon size={64} strokeWidth={1.4} className="" />
      <LeafIcon size={64} strokeWidth={1.4} className="" />
      <CakeIcon size={64} strokeWidth={1.4} className="" />
    </div>

    <div className="profile-hero-body">
      <Avatar user={user} size="hero" />

      <div className="profile-hero-info">
        <h1>{user.username}</h1>
        <span className="muted">@{user.username}</span>
        {counters && <div className="profile-counters">{counters}</div>}
      </div>

      <div className="profile-hero-actions">
        {actions}
        <button type="button" className="icon-button bordered" aria-label="Compartir perfil" onClick={() => shareProfile(user._id)}>
          <ShareIcon size={18} className="" />
        </button>
        {showSettings && (
          <Link to="/settings" className="icon-button bordered profile-settings-mobile" aria-label="Configuración de la cuenta">
            <GearIcon size={18} className="" />
          </Link>
        )}
      </div>
    </div>
  </section>
)

export default ProfileHeader

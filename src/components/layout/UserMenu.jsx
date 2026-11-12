import { Link } from 'react-router'
import Avatar from '../shared/Avatar'
import Dropdown from '../shared/Dropdown'
import { ChevronDownIcon, GearIcon, LogoutIcon, ShieldIcon, UserIcon } from '../shared/Icons'

const UserMenu = ({ user, onLogout }) => (
  <Dropdown
    align="right"
    triggerClassName="user-menu-trigger"
    triggerLabel="Mi perfil y cuenta"
    panelClassName="menu"
    trigger={(
      <>
        <Avatar user={user} />
        <ChevronDownIcon size={16} className="" />
      </>
    )}
  >
    {close => (
      <>
        <div className="menu-header">
          <strong>{user?.username ?? 'Mi cuenta'}</strong>
          {user?.email && <span className="muted small">{user.email}</span>}
        </div>
        <Link to="/profile" className="menu-item" onClick={close}><UserIcon size={18} className="" />Mi perfil</Link>
        <Link to="/settings" className="menu-item" onClick={close}><GearIcon size={18} className="" />Configuración</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="menu-item" onClick={close}><ShieldIcon size={18} className="" />Panel de administración</Link>
        )}
        <button type="button" className="menu-item" onClick={() => { close(); onLogout() }}>
          <LogoutIcon size={18} className="" />Cerrar sesión
        </button>
      </>
    )}
  </Dropdown>
)

export default UserMenu

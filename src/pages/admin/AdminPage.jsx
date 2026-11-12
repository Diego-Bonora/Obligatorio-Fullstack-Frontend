import { NavLink, Outlet } from 'react-router'
import { ChartIcon, FlagIcon, TagIcon, UsersIcon } from '../../components/shared/Icons'

const sections = [
  { to: 'categories', label: 'Categorías', Icon: TagIcon },
  { to: 'reports', label: 'Recetas reportadas', shortLabel: 'Reportes', Icon: FlagIcon },
  { to: 'users', label: 'Usuarios', Icon: UsersIcon },
  { to: 'stats', label: 'Estadísticas', Icon: ChartIcon }
]

const AdminPage = () => {
  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Panel de administración</h1>
        <p className="muted">Gestioná las categorías, los reportes y las cuentas de la comunidad.</p>
      </header>

      <div className="admin-layout">
        <nav className="admin-nav" aria-label="Secciones del panel">
          {sections.map(({ to, label, shortLabel, Icon }) => (
            <NavLink key={to} to={to} className="admin-nav-link">
              <Icon size={20} className="" />
              <span className="admin-nav-label">{label}</span>
              {shortLabel && <span className="admin-nav-short">{shortLabel}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminPage

import { NavLink, Outlet } from 'react-router'

const tabs = [
  { to: 'categories', label: 'Categorías' },
  { to: 'reports', label: 'Recetas reportadas'},
  { to: 'users', label: 'Usuarios' },
  { to: 'stats', label: 'Estadísticas'}
]

const AdminPage = () => {
  return (
    <section className="admin-page">
      <h1>Panel de administración</h1>
      <nav className="tabs" aria-label="Panel de administración">
        {tabs.map(tab => (
          <NavLink key={tab.to} to={tab.to} className="tab">{tab.label}</NavLink>
        ))}
      </nav>
      <Outlet />
    </section>
  )
}

export default AdminPage

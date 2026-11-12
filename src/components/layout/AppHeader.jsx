import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { APP_NAME } from '../../constants/brand'
import Logo from '../shared/Logo'
import { CloseIcon, PlusIcon, SearchIcon } from '../shared/Icons'
import HeaderSearch from './HeaderSearch'
import UserMenu from './UserMenu'

const AppHeader = ({ user, onLogout }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  return (
    <header className="main-header">
      <div className="header-content">
        <Link to="/" className="app-logo" aria-label={`${APP_NAME}, ir al inicio`}><Logo /></Link>

        <div className="header-search-desktop">
          <HeaderSearch />
        </div>

        <nav className="main-nav" aria-label="Principal">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/users" end>Usuarios</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <span className="header-spacer" />

        <Link to="/recipes/new" className="btn primary header-new-recipe"><PlusIcon size={18} />Nueva receta</Link>
        <div className="header-user-menu">
          <UserMenu user={user} onLogout={onLogout} />
        </div>

        {/* Mobile only */}
        <button
          type="button"
          className="icon-button header-search-toggle"
          aria-label={mobileSearchOpen ? 'Cerrar búsqueda' : 'Buscar'}
          aria-expanded={mobileSearchOpen}
          onClick={() => setMobileSearchOpen(prev => !prev)}
        >
          {mobileSearchOpen ? <CloseIcon size={22} className="" /> : <SearchIcon size={22} className="" />}
        </button>
      </div>

      {mobileSearchOpen && (
        <div className="header-search-mobile">
          <HeaderSearch autoFocus onSearched={() => setMobileSearchOpen(false)} />
        </div>
      )}
    </header>
  )
}

export default AppHeader

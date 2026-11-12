import { useState } from 'react'
import { NavLink } from 'react-router'
import { HomeIcon, LogoutIcon, PlusIcon, ShieldIcon, UserIcon, UsersIcon } from '../shared/Icons'
import Modal from '../shared/Modal'

// Mobile only: replaces the links and the user menu of the header.
const BottomNav = ({ isAdmin, onLogout }) => {
  // "Salir" sits next to "Perfil": on a phone it's easy to tap by mistake, so it asks first.
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <nav className="bottom-nav" aria-label="Navegación principal">
        <NavLink to="/" end className="bottom-nav-item"><HomeIcon size={24} strokeWidth={2.2} className="" />Inicio</NavLink>
        <NavLink to="/users" end className="bottom-nav-item"><UsersIcon size={24} strokeWidth={2.2} className="" />Usuarios</NavLink>
        <NavLink to="/recipes/new" className="bottom-nav-new" aria-label="Nueva receta">
          <span><PlusIcon size={26} strokeWidth={2.6} className="" /></span>
        </NavLink>
        {isAdmin && <NavLink to="/admin" className="bottom-nav-item"><ShieldIcon size={24} strokeWidth={2.2} className="" />Admin</NavLink>}
        <NavLink to="/profile" className="bottom-nav-item"><UserIcon size={24} strokeWidth={2.2} className="" />Perfil</NavLink>
        <button type="button" className="bottom-nav-item logout" onClick={() => setConfirming(true)}>
          <LogoutIcon size={24} strokeWidth={2.2} className="" />Salir
        </button>
      </nav>

      {confirming && (
        <Modal title="¿Cerrar sesión?" onClose={() => setConfirming(false)}>
          <p>Vas a tener que volver a ingresar con tu usuario y contraseña.</p>
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={() => setConfirming(false)}>Cancelar</button>
            <button type="button" className="btn danger" onClick={onLogout}>Cerrar sesión</button>
          </div>
        </Modal>
      )}
    </>
  )
}

export default BottomNav

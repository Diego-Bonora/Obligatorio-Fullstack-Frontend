import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import DeleteAccount from '../../components/profile/DeleteAccount'

const planLabels = { plus: 'Plus', premium: 'Premium' }

const SettingsPage = () => {
  const user = useSelector(state => state.auth.user)

  if (!user) return <p className="loading">Cargando...</p>

  return (
    <section className="page-narrow">
      <Link to="/profile" className="back-link">← Volver a mi perfil</Link>
      <header className="page-header">
        <h1>Configuración de la cuenta</h1>
      </header>

      <section className="card settings-section">
        <h2>Tu cuenta</h2>
        <dl className="settings-list">
          <div><dt>Usuario</dt><dd>@{user.username}</dd></div>
          <div><dt>Email</dt><dd>{user.email}</dd></div>
          {user.role !== 'admin' && <div><dt>Plan</dt><dd>{planLabels[user.plan] ?? user.plan}</dd></div>}
        </dl>
        <p className="muted small">Para cambiar tu usuario, email o foto, usá "Editar perfil" en <Link to="/profile">tu perfil</Link>.</p>
      </section>

      <section className="card settings-section danger-zone" aria-labelledby="danger-zone-title">
        <h2 id="danger-zone-title">Zona de peligro</h2>
        {user.role === 'admin'
          ? <p className="muted">Las cuentas de administrador no se pueden eliminar desde acá.</p>
          : (
            <>
              <p>Eliminar tu cuenta es permanente: no vas a poder volver a ingresar.</p>
              <DeleteAccount />
            </>
          )}
      </section>
    </section>
  )
}

export default SettingsPage

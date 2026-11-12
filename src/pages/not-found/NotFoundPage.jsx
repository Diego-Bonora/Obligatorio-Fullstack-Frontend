import { Link } from 'react-router'
import Logo from '../../components/shared/Logo'
import { PotIcon } from '../../components/shared/Icons'

const NotFoundPage = () => {
  return (
    <main className="not-found">
      <Link to="/" aria-label="Hecho en casa, ir al inicio"><Logo /></Link>
      <span className="not-found-tile tone-butter"><PotIcon size={56} strokeWidth={1.6} className="" /></span>
      <h1>Página no encontrada</h1>
      <p className="muted">La página que buscás no existe o se movió. Volvé al inicio para seguir viendo recetas.</p>
      <Link to="/" className="btn primary">Volver al inicio</Link>
    </main>
  )
}

export default NotFoundPage

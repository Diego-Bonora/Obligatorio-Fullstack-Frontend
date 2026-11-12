import { Link } from 'react-router'

const NotFoundPage = () => {
  return (
    <div className="container narrow-page">
      <h1>Página no encontrada</h1>
      <Link to="/" className="btn primary">Volver al inicio</Link>
    </div>
  )
}

export default NotFoundPage

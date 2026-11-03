import { Link } from 'react-router'

const LoginPage = () => {
  return (
    <div className="container auth-container">
      <h1>🍲 Ingresar</h1>
      <p className="register-link">
        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
      </p>
    </div>
  )
}

export default LoginPage

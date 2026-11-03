import { Link } from 'react-router'

const RegisterPage = () => {
  return (
    <div className="container auth-container">
      <h1>🍲 Crear cuenta</h1>
      <p className="register-link">
        ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
      </p>
    </div>
  )
}

export default RegisterPage

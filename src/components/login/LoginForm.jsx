import { useId, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { joiResolver } from '@hookform/resolvers/joi'
import api from '../../api/api'
import { loginSuccess } from '../../features/auth/auth.slice'
import { setPendingMessage } from '../../features/messages/messages.slice'
import { getErrorMessage } from '../../utils/apiError'
import { loginSchema } from '../../validators/auth.validators'
import PasswordInput from '../shared/PasswordInput'

const LoginForm = () => {
  const dispatch = useDispatch()
  const usernameId = useId()
  const passwordId = useId()
  const [serverError, setServerError] = useState(null)
  const { handleSubmit, register, formState: { errors, isValid, isSubmitting } } = useForm({
    resolver: joiResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { username: '', password: '' }
  })

  const handleLogin = async (credentials) => {
    setServerError(null)
    try {
      const { data } = await api.post('/auth/login', credentials)
      dispatch(setPendingMessage(data.message))
      // PublicOnlyRoute sees the token and redirects to the feed
      dispatch(loginSuccess(data.token))
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(handleLogin)}>
      <div className="auth-form-header">
        <h1>¡Hola de nuevo!</h1>
        <p>Ingresá para ver qué cocinaron tus amigos.</p>
      </div>

      <div className="form-group">
        <label htmlFor={usernameId}>Usuario</label>
        <input
          type="text"
          id={usernameId}
          autoComplete="username"
          placeholder="tu.usuario"
          aria-invalid={!!errors.username}
          {...register('username')}
        />
        {errors.username && <span className="error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={passwordId}>Contraseña</label>
        <PasswordInput id={passwordId} autoComplete="current-password" aria-invalid={!!errors.password} {...register('password')} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      {serverError && <p className="error" role="alert">{serverError}</p>}

      <button type="submit" className="btn primary block" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </button>

      <p className="auth-switch">
        ¿No tenés cuenta? <Link to="/register">Creá una gratis</Link>
      </p>
    </form>
  )
}

export default LoginForm

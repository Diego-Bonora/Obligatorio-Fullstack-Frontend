import { useId, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router'
import { joiResolver } from '@hookform/resolvers/joi'
import api from '../../api/api'
import { registerSuccess } from '../../features/auth/auth.slice'
import { setPendingMessage } from '../../features/messages/messages.slice'
import { getErrorMessage } from '../../utils/apiError'
import { registerSchema } from '../../validators/auth.validators'
import PasswordInput from '../shared/PasswordInput'
import PasswordStrength from './PasswordStrength'

const RegisterForm = () => {
  const dispatch = useDispatch()
  const usernameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPasswordId = useId()
  const [serverError, setServerError] = useState(null)
  const { handleSubmit, register, trigger, getValues, control, formState: { errors, isValid, isSubmitting } } = useForm({
    resolver: joiResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' }
  })
  const password = useWatch({ control, name: 'password' })

  const validatePass = () => {
    if (getValues('confirmPassword')) trigger('confirmPassword')
  }

  const createAccount = async ({ username, email, password }) => {
    setServerError(null)
    try {
      const { data } = await api.post('/auth/register', { username, email, password })
      dispatch(setPendingMessage(data.message))
      // PublicOnlyRoute sees the token and redirects to /welcome
      dispatch(registerSuccess(data.token))
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(createAccount)}>
      <div className="auth-form-header">
        <span className="step-badge">PASO 1 DE 2</span>
        <h1>Creá tu cuenta</h1>
        <p>Guardá tus recetas favoritas y seguí a otros cocineros.</p>
      </div>

      <div className="form-group">
        <label htmlFor={usernameId}>Usuario</label>
        <div className="input-shell">
          <span className="input-prefix" aria-hidden="true">@</span>
          <input
            type="text"
            id={usernameId}
            autoComplete="username"
            placeholder="tu.usuario"
            aria-invalid={!!errors.username}
            {...register('username')}
          />
        </div>
        {errors.username && <span className="error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={emailId}>Email</label>
        <input
          type="email"
          id={emailId}
          autoComplete="email"
          placeholder="vos@ejemplo.com"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={passwordId}>Contraseña</label>
        <PasswordInput
          id={passwordId}
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register('password', { onChange: validatePass })}
        />
        <PasswordStrength password={password} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={confirmPasswordId}>Confirmar contraseña</label>
        <PasswordInput
          id={confirmPasswordId}
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
      </div>

      {serverError && <p className="error" role="alert">{serverError}</p>}

      <button type="submit" className="btn primary block" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="auth-switch">
        ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
      </p>
    </form>
  )
}

export default RegisterForm

import { useId, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { joiResolver } from '@hookform/resolvers/joi'
import api from '../../api/api'
import { loginSuccess } from '../../features/auth/auth.slice'
import { setPendingMessage } from '../../features/messages/messages.slice'
import { getErrorMessage } from '../../utils/apiError'
import { registerSchema } from '../../validators/auth.validators'

const RegisterForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const usernameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPasswordId = useId()
  const [serverError, setServerError] = useState(null)
  const { handleSubmit, register, trigger, getValues, formState: { errors, isValid, isSubmitting } } = useForm({
    resolver: joiResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' }
  })

  const validatePass = () => {
    if (getValues('confirmPassword')) trigger('confirmPassword')
  }

  const createAccount = async ({ username, email, password }) => {
    setServerError(null)
    try {
      const { data } = await api.post('/auth/register', { username, email, password })
      dispatch(setPendingMessage(data.message))
      dispatch(loginSuccess(data.token))
      navigate('/', { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit(createAccount)}>
      <div className="form-group">
        <label htmlFor={usernameId}>Usuario</label>
        <input type="text" id={usernameId} autoComplete="username" {...register('username')} />
        {errors.username && <span className="error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={emailId}>Email</label>
        <input type="email" id={emailId} autoComplete="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={passwordId}>Contraseña</label>
        <input type="password" id={passwordId} autoComplete="new-password" {...register('password', { onChange: validatePass })} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={confirmPasswordId}>Confirmar contraseña</label>
        <input type="password" id={confirmPasswordId} autoComplete="new-password" {...register('confirmPassword')} />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
      </div>

      {serverError && <p className="error">{serverError}</p>}

      <button type="submit" className="btn primary" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
    <p className="register-link">
      ¿Ya tenés cuenta? <Link to="/login">Ingresá acá</Link>
    </p>
    </>
  )
}

export default RegisterForm

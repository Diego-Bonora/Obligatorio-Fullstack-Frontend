import { useId } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { joiResolver } from '@hookform/resolvers/joi'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { loginSuccess } from '../../features/auth/auth.slice'
import { getErrorMessage } from '../../utils/apiError'
import { loginSchema } from '../../validators/auth.validators'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const usernameId = useId()
  const passwordId = useId()
  const { handleSubmit, register, formState: { errors, isValid, isSubmitting } } = useForm({
    resolver: joiResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { username: '', password: '' }
  })

  const handleLogin = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials)
      dispatch(loginSuccess(data.token))
      toast.success('¡Bienvenida/o!')
      navigate('/', { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit(handleLogin)}>
      <div className="form-group">
        <label htmlFor={usernameId}>Usuario</label>
        <input type="text" id={usernameId} autoComplete="username" {...register('username')} />
        {errors.username && <span className="error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={passwordId}>Contraseña</label>
        <input type="password" id={passwordId} autoComplete="current-password" {...register('password')} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <button type="submit" className="btn primary" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
    <p className="register-link">
      ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
    </p>
    </>
  )
}

export default LoginForm

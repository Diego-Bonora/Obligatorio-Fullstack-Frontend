import { useId } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { joiResolver } from '@hookform/resolvers/joi'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { loginSuccess } from '../../features/auth/auth.slice'
import { getErrorMessage } from '../../utils/apiError'
import { registerSchema } from '../../validators/auth.validators'

const RegisterForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const usernameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPasswordId = useId()
  const { handleSubmit, register, trigger, getValues, formState: { errors, isValid, isSubmitting } } = useForm({
    resolver: joiResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' }
  })

  const validatePass = () => {
    if (getValues('confirmPassword')) trigger('confirmPassword')
  }

  const createAccount = async ({ username, email, password }) => {
    try {
      const { data } = await api.post('/auth/register', { username, email, password })
      if (data?.token) {
        dispatch(loginSuccess(data.token))
        toast.success('¡Cuenta creada!')
        navigate('/', { replace: true })
      } else {
        toast.success('Cuenta creada, ya podés ingresar')
        navigate('/login', { replace: true })
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit(createAccount)}>
      <div className="form-group">
        <label htmlFor={usernameId}>Usuario:</label>
        <input type="text" id={usernameId} autoComplete="username" {...register('username')} />
        {errors.username && <span className="error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={emailId}>Email:</label>
        <input type="email" id={emailId} autoComplete="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={passwordId}>Contraseña:</label>
        <input type="password" id={passwordId} autoComplete="new-password" {...register('password', { onChange: validatePass })} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={confirmPasswordId}>Confirmar contraseña:</label>
        <input type="password" id={confirmPasswordId} autoComplete="new-password" {...register('confirmPassword')} />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
      </div>

      <button type="submit" className="btn primary" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
    <p className="register-link">
      ¿Ya tienes cuenta? <Link to="/login">Ingresa aquí</Link>
    </p>
    </>
  )
}

export default RegisterForm

import { useId } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { loginSchema } from '../../validators/auth.validators'
import { toast } from 'react-toastify'

const LoginForm = () => {
  const navigate = useNavigate()
  const usernameId = useId()
  const passwordId = useId()
  const { handleSubmit, register, formState: { errors } } = useForm({resolver: joiResolver(loginSchema), mode: 'onChange'})
  
  const ProcesarForm = (data) => {
    localStorage.setItem('usuario', data.username)
    console.log(data)
    toast("Bienvenida/o!");
    toast.success("Inicio de sesión exitoso!");
    toast.info("Redirigiendo al feed...");
    toast.warning("Por favor espera...");
    toast.error("Error al iniciar sesión");
    navigate('/login')
  }
  return (
    <>
    <form onSubmit={handleSubmit(ProcesarForm)}>
            <div className="form-group">
                <label htmlFor={usernameId}>Usuario:</label>
                <input type="text" id={usernameId} {...register('username')} />
                {errors.username && <span className="error">{errors.username.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor={passwordId}>Contraseña:</label>
                <input type="password" id={passwordId} {...register('password')} />
                {errors.password && <span className="error">{errors.password.message}</span>}
            </div>

            <button type="submit" >Ingresar</button>

            
        </form>
        <p className="register-link">
                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
    </>
  )
}

export default LoginForm

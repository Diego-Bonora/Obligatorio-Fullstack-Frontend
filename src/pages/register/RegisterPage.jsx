import AuthLayout from '../../components/auth/AuthLayout'
import RegisterForm from '../../components/register/RegisterForm'

const RegisterPage = () => {
  return (
    <AuthLayout variant="register">
      <RegisterForm />
    </AuthLayout>
  )
}

export default RegisterPage

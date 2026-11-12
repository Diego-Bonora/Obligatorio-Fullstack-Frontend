import AuthLayout from '../../components/auth/AuthLayout'
import LoginForm from '../../components/login/LoginForm'

const LoginPage = () => {
  return (
    <AuthLayout variant="login">
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage

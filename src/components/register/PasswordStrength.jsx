const LEVELS = [
  null,
  { label: 'Débil', className: 'weak' },
  { label: 'Media', className: 'medium' },
  { label: 'Fuerte', className: 'strong' }
]

// Visual hint only: the real rules are still the ones in registerSchema.
const getPasswordLevel = (password = '') => {
  if (!password) return 0

  let points = 0
  if (password.length >= 8) points++
  if (password.length >= 12) points++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++
  if (/\d/.test(password)) points++
  if (/[^A-Za-z0-9]/.test(password)) points++

  if (points <= 1) return 1
  if (points <= 3) return 2
  return 3
}

const PasswordStrength = ({ password }) => {
  const level = getPasswordLevel(password)
  if (level === 0) return null

  const { label, className } = LEVELS[level]

  return (
    <div className={`password-strength ${className}`}>
      {[1, 2, 3].map(bar => (
        <span key={bar} className={`strength-bar${bar <= level ? ' filled' : ''}`} aria-hidden="true" />
      ))}
      <span className="strength-label">
        <span className="visually-hidden">Seguridad de la contraseña: </span>{label}
      </span>
    </div>
  )
}

export default PasswordStrength

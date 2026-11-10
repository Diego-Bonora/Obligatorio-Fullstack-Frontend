import { useSelector } from 'react-redux'
import { PLUS_RECIPE_LIMIT } from '../../utils/plans'

const UsageReport = () => {
  const user = useSelector(state => state.auth.user)

  if (!user) return null

  if (user.plan === 'premium') {
    return (
      <div className="card">
        <p className="stat-label">Recetas publicadas</p>
        <p className="stat-value">{user.recipesCount}</p>
        <p className="muted small">Plan premium, sin límite de recetas.</p>
      </div>
    )
  }

  const usedPercent = Math.round((user.recipesCount / PLUS_RECIPE_LIMIT) * 100)

  return (
    <div className="card">
      <p className="stat-label">Uso del plan plus</p>
      <p className="stat-value">{usedPercent}%</p>
      <div
        className="usage-bar"
        role="progressbar"
        aria-label="Porcentaje de recetas usadas"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={usedPercent}
      >
        <span style={{ width: `${usedPercent}%` }} />
      </div>
      <p className="muted small">{user.recipesCount} de {PLUS_RECIPE_LIMIT} recetas usadas.</p>
    </div>
  )
}

export default UsageReport

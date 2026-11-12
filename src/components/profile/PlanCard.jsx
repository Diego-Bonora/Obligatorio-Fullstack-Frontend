import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { setUser } from '../../features/auth/auth.slice'
import { getErrorMessage } from '../../utils/apiError'
import { PLUS_RECIPE_LIMIT } from '../../utils/plans'
import { CheckIcon } from '../shared/Icons'

const PREMIUM_BENEFITS = ['Recetas sin límite', 'Sustituciones de ingredientes']

export const UsageBar = ({ count }) => {
  const percent = Math.min(100, Math.round((count / PLUS_RECIPE_LIMIT) * 100))

  return (
    <div className="usage">
      <div className="usage-text">
        <span>{count} de {PLUS_RECIPE_LIMIT} recetas publicadas</span>
        <span className="muted">{percent}%</span>
      </div>
      <div
        className="usage-bar"
        role="progressbar"
        aria-label="Recetas publicadas del plan Plus"
        aria-valuemin={0}
        aria-valuemax={PLUS_RECIPE_LIMIT}
        aria-valuenow={count}
      >
        <span style={{ width: `${Math.max(percent, 2)}%` }} />
      </div>
    </div>
  )
}

// "Uso del plan" + "Pasate a premium" in one card (before they were two).
// variant 'full' (profile) or 'sidebar' (feed column).
const PlanCard = ({ variant = 'full' }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const [confirming, setConfirming] = useState(false)
  const [changing, setChanging] = useState(false)

  if (!user || user.role === 'admin') return null

  const upgrade = async () => {
    setChanging(true)
    try {
      const { data: me } = await api.patch('/users/me/plan')
      dispatch(setUser(me))
      toast.success('¡Ya tenés plan premium!')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setChanging(false)
      setConfirming(false)
    }
  }

  if (user.plan === 'premium') {
    return (
      <section className="side-card plan-card">
        <h2>Plan Premium <span className="badge success">ACTIVO</span></h2>
        <p className="muted">{user.recipesCount} {user.recipesCount === 1 ? 'receta publicada' : 'recetas publicadas'}, sin límite.</p>
      </section>
    )
  }

  const upgradeAction = confirming
    ? (
      <div className="confirm-inline">
        <span>¿Cambiar a premium?</span>
        <button type="button" className="btn primary" disabled={changing} onClick={upgrade}>Sí</button>
        <button type="button" className="btn secondary" disabled={changing} onClick={() => setConfirming(false)}>No</button>
      </div>
    )
    : (
      <button
        type="button"
        className={`btn ${variant === 'sidebar' ? 'outline-primary' : 'primary'} block-sm`}
        onClick={() => setConfirming(true)}
      >
        {variant === 'sidebar' ? 'Pasate a premium' : 'Cambiar a premium'}
      </button>
    )

  return (
    <section className="side-card plan-card" id={variant === 'full' ? 'plan' : undefined}>
      <h2>
        {variant === 'sidebar' ? 'Tu plan Plus' : <>Plan Plus <span className="badge success">ACTIVO</span></>}
      </h2>
      <UsageBar count={user.recipesCount} />
      {variant === 'full' && (
        <>
          <hr />
          <strong>Con Premium:</strong>
          <ul className="benefits">
            {PREMIUM_BENEFITS.map(benefit => (
              <li key={benefit}><CheckIcon size={18} strokeWidth={2.6} className="" />{benefit}</li>
            ))}
          </ul>
        </>
      )}
      {upgradeAction}
    </section>
  )
}

export default PlanCard

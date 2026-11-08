import { useId, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'

const restrictions = [
  { value: 'gluten_free', label: 'Sin gluten' },
  { value: 'lactose_free', label: 'Sin lactosa' },
  { value: 'vegetarian', label: 'Vegetariana' }
]

const Substitutions = ({ recipeId }) => {
  const selectId = useId()
  // undefined while /users/me is loading: don't claim "premium only" before we know
  const plan = useSelector(state => state.auth.user?.plan)
  const isPremium = plan === 'premium'
  const [restriction, setRestriction] = useState('gluten_free')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const askSubstitutions = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const { data } = await api.post(`/recipes/${recipeId}/substitutions`, { restriction })
      setResult(data.substitutions)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card detail-section">
      <h2>Adaptar la receta ✨</h2>
      <p className="muted">La IA sugiere reemplazos para los ingredientes según una restricción.</p>

      <div className="substitutions-controls">
        <label htmlFor={selectId} className="visually-hidden">Restricción</label>
        <select id={selectId} value={restriction} onChange={event => setRestriction(event.target.value)} disabled={!isPremium || loading}>
          {restrictions.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <button type="button" className="btn primary" onClick={askSubstitutions} disabled={!isPremium || loading}>
          {loading ? 'Consultando a la IA...' : 'Sugerir reemplazos'}
        </button>
      </div>
      {plan === 'plus' && <p className="notice">Disponible para usuarios premium.</p>}

      {error && <p className="error">{error}</p>}
      {result && result.length === 0 && <p className="muted">No hace falta reemplazar nada 🎉</p>}
      {result && result.length > 0 && (
        <ul className="substitution-list">
          {result.map((item, index) => (
            <li key={index}>
              <strong>{item.original}</strong> → <strong>{item.substitute}</strong>
              <span className="muted">{item.reason}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Substitutions

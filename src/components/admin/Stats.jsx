import { useEffect, useState } from 'react'
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

// Same values as --color-primary, --color-text and --color-border in styles.css
const COLOR_BAR = '#1F7A44'
const COLOR_TEXT = '#1E2422'
const COLOR_GRID = '#DCE0DD'
const CHART_FONT = { family: 'Nunito, system-ui, sans-serif', size: 13 }

const ROW_HEIGHT = 40
const AXIS_HEIGHT = 32

const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { displayColors: false, bodyFont: CHART_FONT, titleFont: CHART_FONT }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: { precision: 0, color: COLOR_TEXT, font: CHART_FONT },
      grid: { color: COLOR_GRID },
      border: { display: false }
    },
    y: {
      ticks: { color: COLOR_TEXT, font: CHART_FONT },
      grid: { display: false },
      border: { color: COLOR_GRID }
    }
  }
}

const mergeUncategorized = (rows) => {
  const named = rows.filter(row => row.category)
  const uncategorized = rows.filter(row => !row.category).reduce((total, row) => total + row.count, 0)
  return uncategorized > 0 ? [...named, { category: 'Sin categoría', count: uncategorized }] : named
}

const StatTile = ({ label, value, tone }) => (
  <div className={`side-card stat-tile${tone ? ` stat-${tone}` : ''}`}>
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
  </div>
)

const RankingChart = ({ title, seriesLabel, rows }) => {
  const data = {
    labels: rows.map(row => row.label),
    datasets: [{
      label: seriesLabel,
      data: rows.map(row => row.value),
      backgroundColor: COLOR_BAR,
      borderRadius: 4,
      maxBarThickness: 20
    }]
  }

  return (
    <div className="side-card chart-card">
      <h3>{title}</h3>
      {rows.length === 0
        ? <p className="loading">Todavía no hay datos.</p>
        : (
          <>
            <div className="chart-canvas" style={{ height: rows.length * ROW_HEIGHT + AXIS_HEIGHT }}>
              <Bar data={data} options={chartOptions} aria-hidden="true" />
            </div>
            <table className="visually-hidden">
              <caption>{title}</caption>
              <thead>
                <tr><th scope="col">Nombre</th><th scope="col">{seriesLabel}</th></tr>
              </thead>
              <tbody>
                {rows.map(row => <tr key={row.label}><td>{row.label}</td><td>{row.value}</td></tr>)}
              </tbody>
            </table>
          </>
        )}
    </div>
  )
}

const Stats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    const loadStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get('/admin/stats')
        if (!ignore) setStats(data)
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadStats()

    return () => { ignore = true }
  }, [reloadCount])

  const usersOnPlan = (plan) => stats.usersByPlan.find(row => row.plan === plan)?.count ?? 0

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h2>Estadísticas</h2>
      </div>

      {loading && <p className="loading">Cargando estadísticas...</p>}

      {error && (
        <div className="feed-error">
          <p className="error">{error}</p>
          <button type="button" className="btn secondary" onClick={() => setReloadCount(prev => prev + 1)}>Reintentar</button>
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="stat-tiles">
            <StatTile label="Usuarios activos" value={usersOnPlan('plus') + usersOnPlan('premium')} tone="primary" />
            <StatTile label="Plan Plus" value={usersOnPlan('plus')} />
            <StatTile label="Plan Premium" value={usersOnPlan('premium')} />
          </div>

          <div className="stat-charts">
            <RankingChart
              title="Recetas por categoría"
              seriesLabel="Recetas"
              rows={mergeUncategorized(stats.recipesByCategory).map(row => ({ label: row.category, value: row.count }))}
            />
            <RankingChart
              title="Autores con más recetas"
              seriesLabel="Recetas"
              rows={stats.topAuthors.map(row => ({ label: `@${row.author}`, value: row.recipesCount }))}
            />
          </div>
        </>
      )}
    </section>
  )
}

export default Stats

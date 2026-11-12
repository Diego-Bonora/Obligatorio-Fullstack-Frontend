import { useState } from 'react'
import { useSelector } from 'react-redux'
import { categoryOptions, difficultyOptions, timeOptions } from '../../utils/filters'
import FilterChip from '../shared/FilterChip'
import Modal from '../shared/Modal'
import { CloseIcon, SlidersIcon } from '../shared/Icons'

// filters: the current values from the URL. onChange(name, value) updates one.
const FeedFilters = ({ filters, onChange, onClear }) => {
  const categories = useSelector(state => state.categories.list)
  const [sheetOpen, setSheetOpen] = useState(false)
  const categoryList = categoryOptions(categories)
  const hasFilters = ['category', 'difficulty', 'maxTime', 'ingredient', 'q', 'tags'].some(key => filters[key])

  return (
    <div className="feed-filters">
      {/* Mobile only: all the filters in one sheet */}
      <button type="button" className="chip filters-sheet-trigger" onClick={() => setSheetOpen(true)}>
        <SlidersIcon size={16} className="" />Filtros
      </button>

      {filters.q && (
        <button type="button" className="chip active" aria-label={`Quitar búsqueda: ${filters.q}`} onClick={() => onChange('q', '')}>
          “{filters.q}”<CloseIcon size={16} strokeWidth={2.5} className="" />
        </button>
      )}
      {filters.ingredient && (
        <button type="button" className="chip active" aria-label={`Quitar ingrediente: ${filters.ingredient}`} onClick={() => onChange('ingredient', '')}>
          Con {filters.ingredient}<CloseIcon size={16} strokeWidth={2.5} className="" />
        </button>
      )}
      {filters.tags && (
        <button type="button" className="chip active" aria-label={`Quitar etiqueta: ${filters.tags}`} onClick={() => onChange('tags', '')}>
          #{filters.tags}<CloseIcon size={16} strokeWidth={2.5} className="" />
        </button>
      )}
      {/* On phones the empty ones are picked in the sheet; only the active ones stay here to remove them */}
      <span className="feed-filter-chips">
        <FilterChip label="Categoría" options={categoryList} value={filters.category ?? ''} onChange={value => onChange('category', value)} />
        <FilterChip label="Dificultad" options={difficultyOptions} value={filters.difficulty ?? ''} onChange={value => onChange('difficulty', value)} />
        <FilterChip label="Tiempo" options={timeOptions} value={filters.maxTime ?? ''} onChange={value => onChange('maxTime', value)} />
      </span>

      {hasFilters && (
        <>
          <span className="filters-spacer" />
          <button type="button" className="text-button" onClick={onClear}>Limpiar filtros</button>
        </>
      )}

      {sheetOpen && (
        <Modal title="Filtros" onClose={() => setSheetOpen(false)}>
          <div className="recipe-form">
            <div className="form-group">
              <label htmlFor="sheet-category">Categoría</label>
              <select id="sheet-category" value={filters.category ?? ''} onChange={event => onChange('category', event.target.value)}>
                <option value="">Todas las categorías</option>
                {categoryList.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="sheet-difficulty">Dificultad</label>
              <select id="sheet-difficulty" value={filters.difficulty ?? ''} onChange={event => onChange('difficulty', event.target.value)}>
                <option value="">Todas las dificultades</option>
                {difficultyOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="sheet-time">Tiempo</label>
              <select id="sheet-time" value={filters.maxTime ?? ''} onChange={event => onChange('maxTime', event.target.value)}>
                <option value="">Cualquier tiempo</option>
                {timeOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="form-actions">
              {hasFilters && <button type="button" className="btn secondary" onClick={onClear}>Limpiar filtros</button>}
              <button type="button" className="btn primary" onClick={() => setSheetOpen(false)}>Ver recetas</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default FeedFilters

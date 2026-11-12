import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { SearchIcon } from '../shared/Icons'

const MAX_LENGTH = 50

// Uses the ingredient search that the feed already has (?ingredient=...).
const HeaderSearchForm = ({ initialValue, autoFocus, onSearched }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [value, setValue] = useState(initialValue)

  const search = (event) => {
    event.preventDefault()
    const ingredient = value.trim()
    // on the feed, keep the current tab and filters and only change the ingredient
    const params = new URLSearchParams(location.pathname === '/' ? location.search : '')
    if (ingredient) params.set('ingredient', ingredient)
    else params.delete('ingredient')
    const query = params.toString()
    navigate(query ? `/?${query}` : '/')
    onSearched?.()
  }

  return (
    <form className="header-search" role="search" onSubmit={search}>
      <SearchIcon size={18} className="header-search-icon" />
      <input
        type="search"
        aria-label="Buscar recetas por ingrediente"
        placeholder="Buscá recetas por ingrediente"
        maxLength={MAX_LENGTH}
        value={value}
        autoFocus={autoFocus}
        onChange={event => setValue(event.target.value)}
      />
    </form>
  )
}

const HeaderSearch = (props) => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const current = location.pathname === '/' ? (searchParams.get('ingredient') ?? '') : ''

  // the key resets the input when the ingredient changes from somewhere else (chips, "Limpiar filtros")
  return <HeaderSearchForm key={current} initialValue={current} {...props} />
}

export default HeaderSearch

import Dropdown from './Dropdown'
import { CheckIcon, ChevronDownIcon, CloseIcon } from './Icons'

// One filter as a chip. Without a value it opens a menu with the options
// (the same ones the old <select> had). With a value it turns dark and clicking it clears the filter.
const FilterChip = ({ label, options, value, onChange }) => {
  const selected = options.find(option => option.value === value)

  if (selected) {
    return (
      <button
        type="button"
        className="chip active"
        aria-label={`Quitar filtro ${label}: ${selected.label}`}
        onClick={() => onChange('')}
      >
        {selected.label}
        <CloseIcon size={16} strokeWidth={2.5} className="" />
      </button>
    )
  }

  return (
    <Dropdown
      triggerClassName="chip"
      panelClassName="menu"
      trigger={<>{label}<ChevronDownIcon size={16} strokeWidth={2.5} className="" /></>}
    >
      {close => (
        <div role="menu" aria-label={label}>
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={option.value === value}
              className="menu-item"
              onClick={() => { onChange(option.value); close() }}
            >
              {option.label}
              {option.value === value && <CheckIcon size={16} className="check" />}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  )
}

export default FilterChip

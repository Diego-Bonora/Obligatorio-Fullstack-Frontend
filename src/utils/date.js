const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

const units = [
  ['year', 31536000],
  ['month', 2592000],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
]

export const formatRelativeDate = (date) => {
  const seconds = Math.round((new Date(date) - Date.now()) / 1000)
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit)
  }
  return 'recién'
}

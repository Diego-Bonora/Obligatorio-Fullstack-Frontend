export const difficultyOptions = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Media' },
  { value: 'hard', label: 'Difícil' }
]

export const timeOptions = [
  { value: '15', label: 'Hasta 15 min' },
  { value: '30', label: 'Hasta 30 min' },
  { value: '60', label: 'Hasta 1 hora' }
]

export const categoryOptions = (categories) => categories
  .filter(category => category.active)
  .map(category => ({ value: category._id, label: category.name }))

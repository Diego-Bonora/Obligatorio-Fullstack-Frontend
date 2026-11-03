export const getErrorMessage = (error) => {
  if (!error.response) return 'No se pudo conectar con el servidor'

  const { message, details } = error.response.data ?? {}
  if (Array.isArray(details) && details.length > 0) {
    return details.map((detail) => detail.message).join('. ')
  }
  return message || 'Ocurrió un error inesperado'
}

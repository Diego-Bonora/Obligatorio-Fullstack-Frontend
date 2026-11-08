const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.totalPages <= 1) return null

  const { page, totalPages } = meta

  return (
    <nav className="pagination">
      <button type="button" className="btn secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Anterior
      </button>
      <span>Página {page} de {totalPages}</span>
      <button type="button" className="btn secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Siguiente
      </button>
    </nav>
  )
}

export default Pagination

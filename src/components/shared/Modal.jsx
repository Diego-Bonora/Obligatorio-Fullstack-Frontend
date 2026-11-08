import { useEffect } from 'react'

// Without `onClose` the modal can't be closed (used while a form is saving).
const Modal = ({ title, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (!onClose) return

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={event => event.stopPropagation()}>
        <header className="modal-header">
          <h2>{title}</h2>
          {onClose && <button type="button" className="btn link" aria-label="Cerrar" onClick={onClose}>✕</button>}
        </header>
        {children}
      </div>
    </div>
  )
}

export default Modal

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

// Button + floating panel. The panel uses position: fixed, so it isn't clipped by
// containers with overflow (like the horizontal row of filter chips on mobile).
// `children` is a function that receives `close`.
const Dropdown = ({ trigger, triggerClassName, triggerLabel, align = 'left', panelClassName = '', children }) => {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const panelId = useId()

  const close = useCallback(() => setOpen(false), [])

  useLayoutEffect(() => {
    if (!open) return
    const rect = triggerRef.current.getBoundingClientRect()
    const top = rect.bottom + 6
    setPosition(align === 'right'
      ? { top, right: Math.max(8, window.innerWidth - rect.right) }
      : { top, left: Math.min(rect.left, window.innerWidth - 248) })
  }, [open, align])

  useEffect(() => {
    if (!open) return

    const closeOnOutside = (event) => {
      if (!panelRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) close()
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        close()
        triggerRef.current?.focus()
      }
    }
    // a fixed panel would stay in place while the page moves
    const closeOnScroll = (event) => {
      if (!panelRef.current?.contains(event.target)) close()
    }

    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    window.addEventListener('scroll', closeOnScroll, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('scroll', closeOnScroll, true)
      window.removeEventListener('resize', close)
    }
  }, [open, close])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        aria-label={triggerLabel}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen(prev => !prev)}
      >
        {trigger}
      </button>
      {open && position && (
        <div id={panelId} ref={panelRef} className={`dropdown-panel ${panelClassName}`} style={position}>
          {children(close)}
        </div>
      )}
    </>
  )
}

export default Dropdown

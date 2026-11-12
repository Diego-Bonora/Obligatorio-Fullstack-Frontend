import { useRef } from 'react'
import { CameraIcon } from './Icons'

// The native file input stays (hidden) so react-hook-form's register() keeps working;
// the preview and the button are <label>s for it, so clicking them opens the picker.
const ImageInput = ({ id, label, shape = 'wide', preview, fallback, fileName, error, onClear, inputProps }) => {
  const { ref: registerRef, ...registerProps } = inputProps
  const inputRef = useRef(null)

  const setRefs = (element) => {
    inputRef.current = element
    registerRef(element)
  }

  const clear = () => {
    // The browser keeps the chosen file in the input until its value is reset by hand.
    inputRef.current.value = ''
    onClear()
  }

  return (
    <div className="form-group">
      <span className="form-label">{label}</span>
      <div className={`image-input ${shape}`}>
        <input id={id} ref={setRefs} type="file" accept="image/jpeg,image/png" className="visually-hidden" aria-label={label} {...registerProps} />
        <label htmlFor={id} className={`image-input-preview${preview ? ' has-image' : ''}`}>
          {preview ? <img src={preview} alt="" /> : fallback}
          <span className="image-input-badge"><CameraIcon size={16} className="" /></span>
        </label>

        <div className="image-input-info">
          <label htmlFor={id} className="btn secondary">{preview ? 'Cambiar imagen' : 'Elegir imagen'}</label>
          <span className="muted small">{fileName ?? 'JPG o PNG, hasta 4 MB'}</span>
          {fileName && (
            <button type="button" className="image-input-clear" onClick={clear}>Quitar</button>
          )}
        </div>
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  )
}

export default ImageInput

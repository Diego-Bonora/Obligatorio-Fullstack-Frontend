import { useId, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { setUser } from '../../features/auth/auth.slice'
import { getErrorMessage } from '../../utils/apiError'
import { imageField } from '../../validators/recipe.validators'
import { CameraIcon } from '../shared/Icons'

// Uploads the picture as soon as it's chosen, with the same endpoint as "Editar perfil".
const PhotoPicker = ({ user }) => {
  const dispatch = useDispatch()
  const inputId = useId()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const uploadPhoto = async (event) => {
    const files = event.target.files
    if (!files?.[0]) return

    const { error: validationError } = imageField.validate(files)
    if (validationError) {
      setError(validationError.message)
      event.target.value = ''
      return
    }

    setError(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('profilePicture', files[0])
      await api.patch('/users/me/picture', formData)
      const { data: me } = await api.get('/users/me')
      dispatch(setUser(me))
      toast.success('Foto de perfil actualizada')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const hasPhoto = Boolean(user.profilePicture)

  return (
    <div className="photo-picker">
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png"
        className="visually-hidden"
        disabled={uploading}
        onChange={uploadPhoto}
      />
      <label htmlFor={inputId} className={`photo-picker-button${hasPhoto ? ' has-photo' : ''}`}>
        {hasPhoto
          ? <img src={user.profilePicture} alt="" />
          : <CameraIcon size={28} strokeWidth={1.8} className="" />}
        <span className="visually-hidden">{hasPhoto ? 'Cambiar foto de perfil' : 'Agregar foto de perfil'}</span>
      </label>

      <div className="photo-picker-text">
        <strong>@{user.username}</strong>
        <span className="muted">
          {uploading
            ? 'Subiendo foto...'
            : hasPhoto ? '¡Lista! Tocá la foto para cambiarla' : 'Agregá una foto para que te reconozcan'}
        </span>
        {error && <span className="error" role="alert">{error}</span>}
      </div>
    </div>
  )
}

export default PhotoPicker

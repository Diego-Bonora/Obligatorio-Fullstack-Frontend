import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { setUser } from '../../features/auth/auth.slice'
import { getErrorMessage } from '../../utils/apiError'
import { profileSchema } from '../../validators/auth.validators'
import { PencilIcon } from '../shared/Icons'
import Modal from '../shared/Modal'

const ProfileForm = ({ user, onSaved, onCancel, onBusyChange }) => {
  const dispatch = useDispatch()
  const imageId = useId()
  const usernameId = useId()
  const emailId = useId()
  const [serverError, setServerError] = useState(null)

  const { register, handleSubmit, control, formState: { errors, isValid, isSubmitting, dirtyFields } } = useForm({
    resolver: joiResolver(profileSchema),
    mode: 'onChange',
    defaultValues: { username: user.username, email: user.email ?? '' }
  })

  const imageFile = useWatch({ control, name: 'image' })?.[0]
  const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile])
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])
  const shownImage = previewUrl ?? user.profilePicture
  const hasChanges = Object.keys(dirtyFields).some(field => field !== 'image' || imageFile)

  useEffect(() => {
    onBusyChange(isSubmitting)
  }, [isSubmitting, onBusyChange])

  const saveProfile = async ({ username, email, image }) => {
    setServerError(null)

    const body = {}
    if (username !== user.username) body.username = username
    if (email !== user.email) body.email = email
    const hasDataChanges = Object.keys(body).length > 0

    if (hasDataChanges) {
      try {
        await api.put('/users/me', body)
      } catch (error) {
        setServerError(getErrorMessage(error))
        return
      }
    }

    let imageFailed = false
    if (image?.[0]) {
      try {
        const formData = new FormData()
        formData.append('profilePicture', image[0])
        await api.patch('/users/me/picture', formData)
      } catch (error) {
        if (!hasDataChanges) {
          setServerError(getErrorMessage(error))
          return
        }
        imageFailed = true
        toast.warning(`Perfil guardado, pero no se pudo subir la foto: ${getErrorMessage(error)}`)
      }
    }

    try {
      const { data: me } = await api.get('/users/me')
      dispatch(setUser(me))
    } catch (error) {
      console.error('Error al actualizar el usuario:', error)
    }

    onSaved(imageFailed ? null : 'Perfil actualizado')
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit(saveProfile)}>
      <div className="form-group">
        <label htmlFor={imageId}>Foto de perfil (JPG o PNG, hasta 4 MB)</label>
        {shownImage && !errors.image && (
          <span className="avatar large"><img src={shownImage} alt="Vista previa" /></span>
        )}
        <input id={imageId} type="file" accept="image/jpeg,image/png" {...register('image')} />
        {errors.image && <span className="error">{errors.image.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={usernameId}>Usuario</label>
        <input id={usernameId} type="text" autoComplete="username" {...register('username')} />
        {errors.username && <span className="error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={emailId}>Email</label>
        <input id={emailId} type="email" autoComplete="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      {serverError && <p className="error">{serverError}</p>}

      <div className="form-actions">
        <button type="button" className="btn secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
        <button type="submit" className="btn primary" disabled={!isValid || !hasChanges || isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}

const Edit = () => {
  const user = useSelector(state => state.auth.user)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const closeModal = useCallback(() => setOpen(false), [])

  const handleSaved = (message) => {
    setOpen(false)
    setSaving(false)
    toast.success(message)
  }

  return (
    <>
      <button type="button" className="btn secondary" onClick={() => setOpen(true)}>
        <PencilIcon />Editar perfil
      </button>

      {open && (
        <Modal title="Editar perfil" onClose={saving ? undefined : closeModal}>
          <ProfileForm user={user} onSaved={handleSaved} onCancel={closeModal} onBusyChange={setSaving} />
        </Modal>
      )}
    </>
  )
}

export default Edit

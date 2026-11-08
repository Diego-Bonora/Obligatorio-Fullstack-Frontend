import { useCallback, useEffect, useId, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import { reportSchema } from '../../validators/report.validators'
import Modal from '../shared/Modal'

const ReportForm = ({ recipeId, onDone, onCancel, onBusyChange }) => {
  const reasonId = useId()
  const detailsId = useId()
  const [serverError, setServerError] = useState(null)

  const { register, handleSubmit, control, formState: { errors, isValid, isSubmitting } } = useForm({
    resolver: joiResolver(reportSchema),
    mode: 'onChange',
    defaultValues: { reason: '', details: '' }
  })
  const detailsLength = useWatch({ control, name: 'details' }).length

  useEffect(() => {
    onBusyChange(isSubmitting)
  }, [isSubmitting, onBusyChange])

  const sendReport = async ({ reason, details }) => {
    setServerError(null)
    try {
      const { data } = await api.post(`/recipes/${recipeId}/report`, details ? { reason, details } : { reason })
      toast.success(data.message)
      onDone()
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit(sendReport)}>
      <div className="form-group">
        <label htmlFor={reasonId}>Motivo *</label>
        <select id={reasonId} {...register('reason')}>
          <option value="" disabled>Elegí un motivo</option>
          <option value="spam">Spam</option>
          <option value="inappropriate_content">Contenido inapropiado</option>
          <option value="other">Otro</option>
        </select>
        {errors.reason && <span className="error">{errors.reason.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={detailsId}>Detalle (opcional)</label>
        <textarea id={detailsId} rows={3} {...register('details')} />
        <span className="char-count">{detailsLength}/300</span>
        {errors.details && <span className="error">{errors.details.message}</span>}
      </div>

      {serverError && <p className="error">{serverError}</p>}

      <div className="form-actions">
        <button type="button" className="btn secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
        <button type="submit" className="btn danger" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar reporte'}
        </button>
      </div>
    </form>
  )
}

const ReportButton = ({ recipeId }) => {
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const close = useCallback(() => {
    setOpen(false)
    setSending(false)
  }, [])

  return (
    <>
      <button type="button" className="btn secondary" onClick={() => setOpen(true)}>Reportar</button>
      {open && (
        <Modal title="Reportar receta" onClose={sending ? undefined : close}>
          <ReportForm recipeId={recipeId} onDone={close} onCancel={close} onBusyChange={setSending} />
        </Modal>
      )}
    </>
  )
}

export default ReportButton

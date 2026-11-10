import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import { categorySchema } from '../../validators/category.validators'

const CategoryForm = ({ category, onSaved, onCancel, onBusyChange }) => {
  const nameId = useId()
  const descriptionId = useId()
  const [serverError, setServerError] = useState(null)

  const { register, handleSubmit, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
    resolver: joiResolver(categorySchema),
    mode: 'onChange',
    defaultValues: { name: category?.name ?? '', description: category?.description ?? '' }
  })

  useEffect(() => {
    onBusyChange(isSubmitting)
  }, [isSubmitting, onBusyChange])

  const saveCategory = async (values) => {
    setServerError(null)
    try {
      if (category) await api.patch(`/categories/${category._id}`, values)
      else await api.post('/categories', values)
      await onSaved()
    } catch (error) {
      setServerError(getErrorMessage(error)) 
    }
  }

  return (
    <form className="category-form" onSubmit={handleSubmit(saveCategory)}>
        <div className="form-group">
            <label htmlFor={nameId}>Nombre </label>
            <input id={nameId} {...register('name')} />
            {errors.name && <span className="error">{errors.name.message}</span>}
        </div>
        <div className="form-group">
            <label htmlFor={descriptionId}>Descripción </label>
            <textarea id={descriptionId} rows={3} {...register('description')} />
            {errors.description && <span className="error">{errors.description.message}</span>}
        </div>

        {serverError && <p className="error">{serverError}</p>}

        <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className="btn primary" disabled={!isValid || !isDirty || isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
        </div>
    </form>
        
  )}

  export default CategoryForm
import { useEffect, useId, useMemo, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import { recipeSchema } from '../../validators/recipe.validators'
import { CameraIcon } from '../shared/Icons'
import ImageInput from '../shared/ImageInput'

const emptyRecipe = {
  title: '',
  description: '',
  prepTime: '',
  servings: '',
  difficulty: 'easy',
  category: '',
  tags: '',
  ingredients: [{ name: '', quantity: '' }],
  steps: [{ text: '' }]
}

const toFormValues = (recipe) => ({
  title: recipe.title,
  description: recipe.description ?? '',
  prepTime: recipe.prepTime,
  servings: recipe.servings,
  difficulty: recipe.difficulty,
  category: recipe.category ?? '',
  tags: recipe.tags.join(', '),
  ingredients: recipe.ingredients.map(({ name, quantity }) => ({ name, quantity })),
  steps: recipe.steps.map(text => ({ text }))
})

// Without `recipe` it creates one; with `recipe` it edits that one.
const RecipeForm = ({ recipe, onSaved, onCancel, onBusyChange }) => {
  const titleId = useId()
  const descriptionId = useId()
  const prepTimeId = useId()
  const servingsId = useId()
  const difficultyId = useId()
  const categoryId = useId()
  const tagsId = useId()
  const imageId = useId()

  const isEdit = Boolean(recipe)
  const categories = useSelector(state => state.categories.list)
  const [serverError, setServerError] = useState(null)

  const { register, handleSubmit, control, resetField, formState: { errors, isValid, isSubmitting, dirtyFields } } = useForm({
    resolver: joiResolver(recipeSchema),
    mode: 'onChange',
    defaultValues: isEdit ? toFormValues(recipe) : emptyRecipe
  })

  const ingredients = useFieldArray({ control, name: 'ingredients' })
  const steps = useFieldArray({ control, name: 'steps' })

  const imageFile = useWatch({ control, name: 'image' })?.[0]
  const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile])
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])
  const shownImage = previewUrl ?? recipe?.imageUrl
  // isDirty turns true on its own because of the file input, so count the fields the user really changed.
  // `image` stays dirty after picking a file and then cancelling the picker, so it only counts with a file.
  const changedFields = Object.keys(dirtyFields).filter(field => field !== 'image' || imageFile)
  const hasChanges = changedFields.length > 0
  const onlyImageChanged = isEdit && Boolean(imageFile) && changedFields.every(field => field === 'image')

  // the modal must not close while a save is running, or the user can publish twice
  useEffect(() => {
    onBusyChange?.(isSubmitting)
  }, [isSubmitting, onBusyChange])

  const uploadImage = async (recipeId, file) => {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await api.patch(`/recipes/${recipeId}/image`, formData)
    return data
  }

  const saveRecipe = async ({ image, tags, steps, description, category, ...fields }) => {
    setServerError(null)

    if (onlyImageChanged) {
      try {
        const data = await uploadImage(recipe._id, image[0])
        toast.success(data.message)
        onSaved(data.recipe)
      } catch (error) {
        setServerError(getErrorMessage(error))
      }
      return
    }

    // the API wants steps as plain strings; empty optional fields are left out so the AI fills them on create
    const body = { ...fields, steps: steps.map(step => step.text) }
    if (description) body.description = description
    if (category) body.category = category
    const tagList = tags.split(',').map(tag => tag.trim()).filter(Boolean)
    if (tagList.length > 0 || isEdit) body.tags = tagList

    let saved
    try {
      const { data } = isEdit
        ? await api.patch(`/recipes/${recipe._id}`, body)
        : await api.post('/recipes', body)
      saved = data
    } catch (error) {
      setServerError(getErrorMessage(error))
      return
    }

    // the image needs the recipe id, so it goes in a second request
    if (image?.[0]) {
      try {
        const data = await uploadImage(saved.recipe._id, image[0])
        saved.recipe = data.recipe
      } catch (error) {
        toast.warning(`Receta guardada, pero no se pudo subir la imagen: ${getErrorMessage(error)}`)
      }
    }

    toast.success(saved.message)
    onSaved(saved.recipe)
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit(saveRecipe)}>
      <div className="form-group">
        <label htmlFor={titleId}>Título *</label>
        <input id={titleId} placeholder="Tortilla de papas" {...register('title')} />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={descriptionId}>Descripción</label>
        <textarea id={descriptionId} rows={3} placeholder="Si la dejás vacía, la IA escribe una" {...register('description')} />
        {errors.description && <span className="error">{errors.description.message}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={prepTimeId}>Tiempo (min) *</label>
          <input id={prepTimeId} type="number" {...register('prepTime', { valueAsNumber: true })} />
          {errors.prepTime && <span className="error">{errors.prepTime.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor={servingsId}>Porciones *</label>
          <input id={servingsId} type="number" {...register('servings', { valueAsNumber: true })} />
          {errors.servings && <span className="error">{errors.servings.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={difficultyId}>Dificultad *</label>
          <select id={difficultyId} {...register('difficulty')}>
            <option value="easy">Fácil</option>
            <option value="medium">Media</option>
            <option value="hard">Difícil</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={categoryId}>Categoría</label>
          <select id={categoryId} {...register('category')}>
            {(!isEdit || !recipe.category) && <option value="">Que la IA la sugiera</option>}
            {categories
              .filter(item => item.active || item._id === recipe?.category)
              .map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
          </select>
        </div>
      </div>

      <fieldset className="form-fieldset">
        <legend>Ingredientes *</legend>
        {ingredients.fields.map((field, index) => (
          <div key={field.id} className="field-row">
            <div className="form-group">
              <input placeholder="Ingrediente" aria-label={`Ingrediente ${index + 1}`} {...register(`ingredients.${index}.name`)} />
              {errors.ingredients?.[index]?.name && <span className="error">{errors.ingredients[index].name.message}</span>}
            </div>
            <div className="form-group">
              <input placeholder="Cantidad" aria-label={`Cantidad ${index + 1}`} {...register(`ingredients.${index}.quantity`)} />
              {errors.ingredients?.[index]?.quantity && <span className="error">{errors.ingredients[index].quantity.message}</span>}
            </div>
            {ingredients.fields.length > 1 && (
              <button type="button" className="btn link" onClick={() => ingredients.remove(index)}>Quitar</button>
            )}
          </div>
        ))}
        {errors.ingredients?.message && <span className="error">{errors.ingredients.message}</span>}
        <button type="button" className="btn link" onClick={() => ingredients.append({ name: '', quantity: '' })}>
          + Agregar ingrediente
        </button>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Pasos *</legend>
        {steps.fields.map((field, index) => (
          <div key={field.id} className="step-row">
            <span className="step-number">{index + 1}</span>
            <div className="form-group">
              <textarea rows={2} aria-label={`Paso ${index + 1}`} {...register(`steps.${index}.text`)} />
              {errors.steps?.[index]?.text && <span className="error">{errors.steps[index].text.message}</span>}
            </div>
            {steps.fields.length > 1 && (
              <button type="button" className="btn link" onClick={() => steps.remove(index)}>Quitar</button>
            )}
          </div>
        ))}
        {errors.steps?.message && <span className="error">{errors.steps.message}</span>}
        <button type="button" className="btn link" onClick={() => steps.append({ text: '' })}>
          + Agregar paso
        </button>
      </fieldset>

      <div className="form-group">
        <label htmlFor={tagsId}>Etiquetas</label>
        <input id={tagsId} placeholder="postre, sin tacc (separadas por coma)" {...register('tags')} />
        {errors.tags && <span className="error">{errors.tags.message}</span>}
      </div>

      <ImageInput
        id={imageId}
        label="Imagen"
        preview={errors.image ? recipe?.imageUrl : shownImage}
        fallback={<span className="image-input-empty"><CameraIcon size={32} strokeWidth={1.6} className="" />Agregá una foto de tu receta</span>}
        fileName={imageFile?.name}
        error={errors.image?.message}
        onClear={() => resetField('image')}
        inputProps={register('image')}
      />

      {serverError && <p className="error">{serverError}</p>}

      <div className="form-actions">
        <button type="button" className="btn secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
        <button type="submit" className="btn primary" disabled={!isValid || !hasChanges || isSubmitting}>
          {isSubmitting && (isEdit ? 'Guardando...' : 'Publicando… la IA está completando tu receta')}
          {!isSubmitting && (isEdit ? 'Guardar cambios' : 'Publicar receta')}
        </button>
      </div>
    </form>
  )
}

export default RecipeForm

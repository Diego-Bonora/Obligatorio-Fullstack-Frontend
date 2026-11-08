import Joi from 'joi'

const MAX_IMAGE_SIZE = 4 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png']

const ingredient = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Falta el ingrediente',
    'string.max': 'Máximo {#limit} caracteres'
  }),
  quantity: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'Falta la cantidad',
    'string.max': 'Máximo {#limit} caracteres'
  })
})

const step = Joi.object({
  text: Joi.string().trim().min(1).max(500).required().messages({
    'string.empty': 'El paso no puede estar vacío',
    'string.max': 'El paso no puede tener más de {#limit} caracteres'
  })
})

export const recipeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'El título es obligatorio',
    'string.min': 'El título debe tener al menos {#limit} caracteres',
    'string.max': 'El título no puede tener más de {#limit} caracteres'
  }),
  description: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'La descripción no puede tener más de {#limit} caracteres'
  }),
  prepTime: Joi.number().integer().min(1).max(1440).required().messages({
    'number.base': 'El tiempo debe ser un número',
    'number.integer': 'El tiempo debe ser un número entero',
    'number.min': 'El tiempo debe ser de al menos {#limit} minuto',
    'number.max': 'El tiempo no puede superar {#limit} minutos'
  }),
  servings: Joi.number().integer().min(1).max(100).required().messages({
    'number.base': 'Las porciones deben ser un número',
    'number.integer': 'Las porciones deben ser un número entero',
    'number.min': 'Debe haber al menos {#limit} porción',
    'number.max': 'No puede haber más de {#limit} porciones'
  }),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').required().messages({
    'any.only': 'Elegí una dificultad'
  }),
  category: Joi.string().allow(''),
  ingredients: Joi.array().items(ingredient).min(1).max(50).messages({
    'array.min': 'Agregá al menos un ingrediente',
    'array.max': 'No puede haber más de {#limit} ingredientes'
  }),
  steps: Joi.array().items(step).min(1).max(50).messages({
    'array.min': 'Agregá al menos un paso',
    'array.max': 'No puede haber más de {#limit} pasos'
  }),
  tags: Joi.string().allow('').custom((value, helpers) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean)
    if (tags.length > 10) return helpers.error('tags.count')
    if (tags.some(tag => tag.length > 30)) return helpers.error('tags.length')
    return value
  }).messages({
    'tags.count': 'Podés poner hasta 10 etiquetas',
    'tags.length': 'Cada etiqueta puede tener hasta 30 caracteres'
  }),
  // the file input gives a FileList; the image is optional
  image: Joi.any().custom((files, helpers) => {
    const file = files?.[0]
    if (!file) return files
    if (!IMAGE_TYPES.includes(file.type)) return helpers.error('image.type')
    if (file.size > MAX_IMAGE_SIZE) return helpers.error('image.size')
    return files
  }).messages({
    'image.type': 'Solo se permiten imágenes JPG o PNG',
    'image.size': 'La imagen no puede pesar más de 4 MB'
  })
})

import Joi from 'joi'

export const categorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'El nombre es obligatorio',
    'string.min': 'El nombre debe tener al menos {#limit} caracteres',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres'
  }),
  description: Joi.string().trim().allow('')
})
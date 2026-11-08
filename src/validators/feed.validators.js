import Joi from 'joi'

export const ingredientSearchSchema = Joi.object({
  ingredient: Joi.string().trim().max(50).allow('').messages({
    'string.max': 'Máximo {#limit} caracteres'
  })
})

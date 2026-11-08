import Joi from 'joi'

export const reportSchema = Joi.object({
  reason: Joi.string().valid('spam', 'inappropriate_content', 'other').required().messages({
    'any.only': 'Elegí un motivo',
    'string.empty': 'Elegí un motivo'
  }),
  details: Joi.string().trim().max(300).allow('').messages({
    'string.max': 'El detalle no puede tener más de {#limit} caracteres'
  })
})

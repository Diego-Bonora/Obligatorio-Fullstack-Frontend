import Joi from 'joi'

export const commentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(300).required().messages({
    'string.empty': 'Escribí un comentario',
    'string.max': 'El comentario no puede tener más de {#limit} caracteres'
  })
})

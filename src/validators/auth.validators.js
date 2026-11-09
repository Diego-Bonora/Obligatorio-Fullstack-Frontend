import Joi from 'joi'
import { imageField } from './recipe.validators'

export const loginSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    'string.empty': 'Ingresá tu usuario',
    'any.required': 'Ingresá tu usuario'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Ingresá tu contraseña',
    'any.required': 'Ingresá tu contraseña'
  })
})

export const registerSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    'string.empty': 'Ingresá un usuario',
    'any.required': 'Ingresá un usuario'
  }),
  // tlds: false because Joi's built-in TLD list is not available in the browser.
  email: Joi.string().trim().email({ tlds: false }).required().messages({
    'string.empty': 'Ingresá tu email',
    'string.email': 'Ingresá un email válido',
    'any.required': 'Ingresá tu email'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Ingresá una contraseña',
    'any.required': 'Ingresá una contraseña'
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Las contraseñas no coinciden',
    'any.required': 'Repetí la contraseña'
  })
})

export const profileSchema = Joi.object({
  image: imageField,
  username: Joi.string().trim().min(3).max(30).required().messages({
    'string.empty': 'Ingresá un usuario',
    'string.min': 'El usuario debe tener al menos {#limit} caracteres',
    'string.max': 'El usuario no puede tener más de {#limit} caracteres',
    'any.required': 'Ingresá un usuario'
  }),
  email: registerSchema.extract('email')
})

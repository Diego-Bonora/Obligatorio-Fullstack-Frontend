import Joi from 'joi'
import { tlds } from '@hapi/tlds'
import { imageField } from './recipe.validators'

export const loginSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required().messages({
    'string.empty': 'Ingresá tu usuario',
    'string.min': 'El usuario debe tener al menos {#limit} caracteres',
    'string.max': 'El usuario no puede tener más de {#limit} caracteres',
    'any.required': 'Ingresá tu usuario'
  }),
  password: Joi.string().min(6).max(30).required().messages({
    'string.empty': 'Ingresá tu contraseña',
    'string.min': 'La contraseña debe tener al menos {#limit} caracteres',
    'string.max': 'La contraseña no puede tener más de {#limit} caracteres',
    'any.required': 'Ingresá tu contraseña'
  })
})

export const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required().messages({
    'string.empty': 'Ingresá un usuario',
    'string.min': 'El usuario debe tener al menos {#limit} caracteres',
    'string.max': 'El usuario no puede tener más de {#limit} caracteres',
    'any.required': 'Ingresá un usuario'
  }),
  email: Joi.string().trim().email({ tlds: { allow: tlds } }).required().messages({
    'string.empty': 'Ingresá tu email',
    'string.email': 'Ingresá un email válido',
    'any.required': 'Ingresá tu email'
  }),
  password: Joi.string().min(6).max(30).required().messages({
    'string.empty': 'Ingresá una contraseña',
    'string.min': 'La contraseña debe tener al menos {#limit} caracteres',
    'string.max': 'La contraseña no puede tener más de {#limit} caracteres',
    'any.required': 'Ingresá una contraseña'
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Las contraseñas no coinciden',
    'any.required': 'Repetí la contraseña'
  })
})

export const profileSchema = Joi.object({
  image: imageField,
  username: registerSchema.extract('username'),
  email: registerSchema.extract('email')
})

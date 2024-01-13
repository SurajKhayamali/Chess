import Joi from 'joi';

export const signUpSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).messages({
    'string.min': 'First name must be at least 3 characters long',
    'string.max': 'First name must be at most 30 characters long',
    'string.pattern.base':
      'First name must contain at least one space character',
    'any.required': 'First name is required',
  }),
  middleName: Joi.string().max(30).messages({
    'string.min': 'First name must be at least 3 characters long',
    'string.max': 'First name must be at most 30 characters long',
    'string.pattern.base':
      'First name must contain at least one space character',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().min(3).max(30).messages({
    'string.min': 'First name must be at least 3 characters long',
    'string.max': 'First name must be at most 30 characters long',
    'string.pattern.base':
      'First name must contain at least one space character',
    'any.required': 'First name is required',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email',
  }),
  username: Joi.string()
    .min(3)
    .max(20)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must be at most 20 characters long',
      'string.pattern.base':
        'Username must contain only alphanumeric characters',
    }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
});

export const loginSchema = Joi.object({
  emailOrUsername: Joi.alternatives()
    .try(
      Joi.string().email(),
      Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    )
    .required()
    .messages({
      'alternatives.types':
        'Email or username must be a valid email or username',
      'alternatives.match':
        'Email or username must be either a valid email or a username',
      'any.required': 'Email or username is required',
    }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).required().messages({
    'string.min': 'Old password must be at least 8 characters long',
    'any.required': 'Old password is required',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'New password must be at least 8 characters long',
    'any.required': 'New password is required',
  }),
});
